import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export type DiagramNode = {
  id: string;
  label: string;
  description: string;
  href: string;
  /** Short kicker above the label, such as the Diataxis type of the page. */
  kind?: string;
  children?: DiagramNode[];
};

export type DiagramLayout = 'tree' | 'flow';

type Edge = {parent: string; child: string};
type Connector = {key: string; d: string; arrow: boolean};
type ActiveMode = 'hover' | 'focus';

type TreeProps = {
  layout?: 'tree';
  data: DiagramNode;
  label?: string;
};

type FlowProps = {
  layout: 'flow';
  data: DiagramNode[];
  label?: string;
};

type Props = TreeProps | FlowProps;

// Matches .card's max-width and .childrenRow's gap in styles.module.css.
// Used to estimate how much room a leaf sibling needs, without waiting on
// a measurement pass.
const CARD_MAX_WIDTH = 210;
const ROW_GAP = 20;

// Corner radius of the elbow connectors, in pixels.
const ELBOW_RADIUS = 8;

// Two flow steps count as sharing a row when their tops line up this
// closely. Anything further apart means the row wrapped.
const SAME_ROW_TOLERANCE = 8;

// Gap left between an arrowhead and the card it points at, in pixels.
const ARROW_GAP = 5;

// Horizontal distance from a rail card's left edge to the shared spine,
// and how far the spine drops out of the parent before it turns. Both
// match .rail in styles.module.css.
const RAIL_OFFSET = 26;
const RAIL_DROP = 18;

// Below this width no row of two cards fits side by side, so the whole
// diagram switches to an indented outline instead of a fork.
const COMPACT_WIDTH = 520;

// Shared so the tree branch of the component never hands useMemo a fresh
// array and restarts the measurement effect on every render.
const NO_STEPS: DiagramNode[] = [];

// useLayoutEffect warns during server-side rendering. This falls back to
// a no-op effect on the server and the real thing in the browser.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function isLeaf(node: DiagramNode): boolean {
  return !node.children || node.children.length === 0;
}

function collectEdges(node: DiagramNode, edges: Edge[] = []): Edge[] {
  node.children?.forEach((child) => {
    edges.push({parent: node.id, child: child.id});
    collectEdges(child, edges);
  });
  return edges;
}

function collectParents(node: DiagramNode, parents: Map<string, string>): void {
  node.children?.forEach((child) => {
    parents.set(child.id, node.id);
    collectParents(child, parents);
  });
}

// Every branch's own children row sizes to its content (shrink-to-fit),
// so a nested row never receives a real width to wrap against on its own.
// This walks the tree once and works out, for each node with children,
// how much on-screen width its row can actually use: the diagram's total
// width, minus a fixed share for any leaf siblings sharing that row, split
// evenly across any siblings that are themselves branches.
function computeRowBudgets(
  node: DiagramNode,
  availableWidth: number,
  budgets: Map<string, number>,
  railRows: Set<string>,
): void {
  if (!node.children || node.children.length === 0) {
    return;
  }
  budgets.set(node.id, availableWidth);

  // A row that cannot sit side by side wraps into a single column, and a
  // column of siblings joined top to bottom reads as a chain instead of a
  // fork. Those rows switch to a rail: one shared spine on the left, one
  // short tick into each card. A single child never needs one.
  const width = availableWidth;
  const stacks = node.children.length > 1 && width < COMPACT_WIDTH;

  if (node.children.every(isLeaf)) {
    if (
      stacks ||
      (node.children.length > 2 &&
        width < node.children.length * (CARD_MAX_WIDTH + ROW_GAP))
    ) {
      railRows.add(node.id);
    }
    return;
  }

  if (stacks) {
    railRows.add(node.id);
  }
  const branchChildren = node.children.filter((child) => !isLeaf(child));
  const leafCount = node.children.length - branchChildren.length;
  const reservedForLeaves = leafCount * (CARD_MAX_WIDTH + ROW_GAP);
  const remaining = Math.max(
    availableWidth - reservedForLeaves,
    CARD_MAX_WIDTH,
  );
  const perBranchWidth = remaining / branchChildren.length;
  branchChildren.forEach((child) =>
    computeRowBudgets(child, perBranchWidth, budgets, railRows),
  );
}

// Draws the right-angle connector that gives the diagram its blueprint
// read: straight down out of the parent, one rounded turn, across, a second
// rounded turn, straight down into the child. The radius shrinks on its own
// when the two cards sit almost in line, so a corner never overshoots.
function elbowPath(x1: number, y1: number, x2: number, y2: number): string {
  if (Math.abs(x2 - x1) < 1) {
    return `M ${x1} ${y1} V ${y2}`;
  }
  const midY = (y1 + y2) / 2;
  const sign = x2 > x1 ? 1 : -1;
  const radius = Math.max(
    0,
    Math.min(ELBOW_RADIUS, Math.abs(x2 - x1) / 2, midY - y1, y2 - midY),
  );
  return [
    `M ${x1} ${y1}`,
    `V ${midY - radius}`,
    `Q ${x1} ${midY} ${x1 + sign * radius} ${midY}`,
    `H ${x2 - sign * radius}`,
    `Q ${x2} ${midY} ${x2} ${midY + radius}`,
    `V ${y2}`,
  ].join(' ');
}

// Draws one branch of a rail: down out of the parent, across to the spine,
// down the spine, then a short tick into the card's left edge. Every child
// in the row shares the same spine x, so their vertical runs stack into one
// continuous line and each card still owns its own highlightable path.
function railPath(
  px: number,
  py: number,
  spineX: number,
  cardLeft: number,
  cardMidY: number,
): string {
  const turnY = py + RAIL_DROP;
  if (cardMidY <= turnY + 2 || Math.abs(spineX - px) < 2) {
    return elbowPath(px, py, cardLeft - RAIL_OFFSET / 2, cardMidY);
  }
  const toSpine = spineX > px ? 1 : -1;
  const radius = Math.max(
    0,
    Math.min(
      ELBOW_RADIUS,
      Math.abs(spineX - px) / 2,
      RAIL_DROP,
      (cardMidY - turnY) / 2,
      RAIL_OFFSET / 2,
    ),
  );
  return [
    `M ${px} ${py}`,
    `V ${turnY - radius}`,
    `Q ${px} ${turnY} ${px + toSpine * radius} ${turnY}`,
    `H ${spineX - toSpine * radius}`,
    `Q ${spineX} ${turnY} ${spineX} ${turnY + radius}`,
    `V ${cardMidY - radius}`,
    `Q ${spineX} ${cardMidY} ${spineX + radius} ${cardMidY}`,
    `H ${cardLeft}`,
  ].join(' ');
}

function Card({
  node,
  registerRef,
  onActivate,
  onClear,
  onPath,
}: {
  node: DiagramNode;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  onActivate: (id: string, mode: ActiveMode) => void;
  onClear: () => void;
  onPath?: boolean;
}): ReactNode {
  return (
    <div className={styles.cardWrapper} ref={(el) => registerRef(node.id, el)}>
      <Link
        to={node.href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.card}
        data-on-path={onPath === undefined ? undefined : String(onPath)}
        onPointerEnter={() => onActivate(node.id, 'hover')}
        onPointerLeave={onClear}
        onFocus={() => onActivate(node.id, 'focus')}
        onBlur={onClear}>
        {node.kind && <span className={styles.cardKind}>{node.kind}</span>}
        <span className={styles.cardLabel}>
          {node.label}
          <span className={styles.cardIcon} aria-hidden="true">
            {/* U+FE0E keeps this a glyph instead of a boxed emoji. */}
            {'↗︎'}
          </span>
        </span>
        <span className={styles.cardDescription}>{node.description}</span>
      </Link>
    </div>
  );
}

function Branch({
  node,
  registerRef,
  rowBudgets,
  railRows,
  onActivate,
  onClear,
  pathNodes,
  hasActive,
}: {
  node: DiagramNode;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  rowBudgets: Map<string, number>;
  railRows: Set<string>;
  onActivate: (id: string, mode: ActiveMode) => void;
  onClear: () => void;
  pathNodes: Set<string>;
  hasActive: boolean;
}): ReactNode {
  // Wrapping a row onto multiple lines is only safe when every child in it
  // is a leaf. Wrapping a row that mixes a leaf with a branch (a child that
  // has its own children) pushes them onto separate lines and makes true
  // siblings look like a parent-child chain instead of a fork.
  const allChildrenAreLeaves = node.children?.every(isLeaf);
  const isRail = railRows.has(node.id);
  const budget = rowBudgets.get(node.id);
  const rowStyle =
    allChildrenAreLeaves && budget && !isRail ? {maxWidth: budget} : undefined;

  let rowClass = `${styles.level} ${styles.childrenRow}`;
  if (isRail) {
    rowClass = `${styles.level} ${styles.rail}`;
  } else if (allChildrenAreLeaves) {
    rowClass += ` ${styles.childrenRowWrap}`;
  }

  return (
    <li className={styles.branch}>
      <Card
        node={node}
        registerRef={registerRef}
        onActivate={onActivate}
        onClear={onClear}
        onPath={hasActive ? pathNodes.has(node.id) : undefined}
      />
      {node.children && node.children.length > 0 && (
        <ul style={rowStyle} className={rowClass}>
          {node.children.map((child) => (
            <Branch
              key={child.id}
              node={child}
              registerRef={registerRef}
              rowBudgets={rowBudgets}
              railRows={railRows}
              onActivate={onActivate}
              onClear={onClear}
              pathNodes={pathNodes}
              hasActive={hasActive}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function TreeDiagram(props: Props): ReactNode {
  const {data, label} = props;
  const layout: DiagramLayout = props.layout ?? 'tree';
  const steps = useMemo(
    () => (layout === 'flow' ? (data as DiagramNode[]) : NO_STEPS),
    [layout, data],
  );
  const root = useMemo(
    () => (layout === 'flow' ? undefined : (data as DiagramNode)),
    [layout, data],
  );

  // useId wraps its value in punctuation that is awkward inside url(#...),
  // so strip everything that is not safe in a fragment reference.
  const markerId = `diagram-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLDivElement>());
  const [lines, setLines] = useState<Connector[]>([]);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [active, setActive] = useState<{id: string; mode: ActiveMode} | null>(
    null,
  );

  const registerRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      nodeRefs.current.set(id, el);
    } else {
      nodeRefs.current.delete(id);
    }
  }, []);

  const handleActivate = useCallback((id: string, mode: ActiveMode) => {
    setActive((current) =>
      // A focus ring outranks a hover: keep it until the element blurs.
      current?.mode === 'focus' && mode === 'hover' ? current : {id, mode},
    );
  }, []);

  const handleClear = useCallback(() => setActive(null), []);

  // In a tree, a node's parent is the node above it. In a flow, it is the
  // step before it. Both collapse to the same map, so the path highlight
  // and the connector list work the same way for either layout.
  const parentMap = useMemo(() => {
    const parents = new Map<string, string>();
    if (root) {
      collectParents(root, parents);
    } else {
      steps.forEach((step, index) => {
        if (index > 0) {
          parents.set(step.id, steps[index - 1].id);
        }
      });
    }
    return parents;
  }, [root, steps]);

  const edges = useMemo<Edge[]>(() => {
    if (root) {
      return collectEdges(root);
    }
    return steps
      .slice(1)
      .map((step, index) => ({parent: steps[index].id, child: step.id}));
  }, [root, steps]);

  const {pathNodes, pathEdges} = useMemo(() => {
    const nodes = new Set<string>();
    const connectors = new Set<string>();
    let current = active?.id;
    while (current && !nodes.has(current)) {
      nodes.add(current);
      const parent = parentMap.get(current);
      if (parent) {
        connectors.add(`${parent}->${current}`);
      }
      current = parent;
    }
    return {pathNodes: nodes, pathEdges: connectors};
  }, [active, parentMap]);

  const {rowBudgets, railRows} = useMemo(() => {
    const budgets = new Map<string, number>();
    const rails = new Set<string>();
    if (root && containerWidth) {
      computeRowBudgets(root, containerWidth, budgets, rails);
    }
    return {rowBudgets: budgets, railRows: rails};
  }, [root, containerWidth]);

  const recompute = useCallback(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) {
      return;
    }
    // The wrapper sizes itself to its own content, so measuring it would
    // feed the layout back into the budget that produced it. The column
    // around it is the stable number.
    const style = window.getComputedStyle(wrapper);
    const padding =
      parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const column = wrapper.parentElement ?? wrapper;
    setContainerWidth(Math.max(column.clientWidth - padding, CARD_MAX_WIDTH));

    const origin = canvas.getBoundingClientRect();
    const next: Connector[] = [];
    edges.forEach(({parent, child}) => {
      const parentEl = nodeRefs.current.get(parent);
      const childEl = nodeRefs.current.get(child);
      if (!parentEl || !childEl) {
        return;
      }
      const p = parentEl.getBoundingClientRect();
      const c = childEl.getBoundingClientRect();
      const key = `${parent}->${child}`;

      // Two flow steps side by side get a straight arrow between them.
      // Anything else, including a flow row that wrapped, gets the elbow.
      if (layout === 'flow' && Math.abs(p.top - c.top) < SAME_ROW_TOLERANCE) {
        const y = p.top + p.height / 2 - origin.top;
        next.push({
          key,
          d: `M ${p.right - origin.left} ${y} H ${
            c.left - origin.left - ARROW_GAP
          }`,
          arrow: true,
        });
        return;
      }

      if (railRows.has(parent)) {
        next.push({
          key,
          d: railPath(
            p.left + p.width / 2 - origin.left,
            p.bottom - origin.top,
            c.left - origin.left - RAIL_OFFSET,
            c.left - origin.left,
            c.top + c.height / 2 - origin.top,
          ),
          arrow: false,
        });
        return;
      }

      const arrow = layout === 'flow';
      next.push({
        key,
        d: elbowPath(
          p.left + p.width / 2 - origin.left,
          p.bottom - origin.top,
          c.left + c.width / 2 - origin.left,
          c.top - origin.top - (arrow ? ARROW_GAP : 0),
        ),
        arrow,
      });
    });
    setLines(next);
  }, [edges, layout, railRows]);

  useIsomorphicLayoutEffect(() => {
    recompute();
    if (typeof ResizeObserver === 'undefined' || !wrapperRef.current) {
      return undefined;
    }
    const observer = new ResizeObserver(() => recompute());
    observer.observe(wrapperRef.current.parentElement ?? wrapperRef.current);
    window.addEventListener('resize', recompute);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', recompute);
    };
  }, [recompute]);

  // The first paint measures cards that are still in the fallback font, so
  // the lines land slightly off. Measure again once the real fonts land.
  useEffect(() => {
    if (typeof document === 'undefined' || !('fonts' in document)) {
      return undefined;
    }
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) {
        recompute();
      }
    });
    return () => {
      cancelled = true;
    };
  }, [recompute]);

  const hasActive = active !== null;

  return (
    <div
      className={styles.wrapper}
      data-layout={layout}
      data-active-mode={active?.mode}
      ref={wrapperRef}
      onPointerLeave={handleClear}>
      <div className={styles.corners} aria-hidden="true">
        <span className={styles.corner} />
        <span className={styles.corner} />
        <span className={styles.corner} />
        <span className={styles.corner} />
      </div>
      <div className={styles.canvas} ref={canvasRef}>
        <svg className={styles.connectors} aria-hidden="true">
          <defs>
            <marker
              id={`${markerId}-base`}
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="6"
              markerHeight="6"
              orient="auto">
              <path d="M 0 1 L 7 4 L 0 7 z" className={styles.arrowBase} />
            </marker>
            <marker
              id={`${markerId}-active`}
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="6"
              markerHeight="6"
              orient="auto">
              <path d="M 0 1 L 7 4 L 0 7 z" className={styles.arrowActive} />
            </marker>
          </defs>
          {lines.map((line) => (
            <path
              key={line.key}
              d={line.d}
              markerEnd={line.arrow ? `url(#${markerId}-base)` : undefined}
              className={styles.edgeBase}
            />
          ))}
          {lines.map((line) => (
            <path
              key={line.key}
              d={line.d}
              pathLength="1"
              markerEnd={line.arrow ? `url(#${markerId}-active)` : undefined}
              className={
                pathEdges.has(line.key)
                  ? `${styles.edgeActive} ${styles.isActive}`
                  : styles.edgeActive
              }
            />
          ))}
        </svg>

        {root ? (
          <ul
            className={`${styles.level} ${styles.rootLevel}`}
            aria-label={label ?? 'Site map'}>
            <Branch
              node={root}
              registerRef={registerRef}
              rowBudgets={rowBudgets}
              railRows={railRows}
              onActivate={handleActivate}
              onClear={handleClear}
              pathNodes={pathNodes}
              hasActive={hasActive}
            />
          </ul>
        ) : (
          <ol className={styles.flow} aria-label={label ?? 'Process steps'}>
            {steps.map((step) => (
              <li key={step.id} className={styles.flowStep}>
                <Card
                  node={step}
                  registerRef={registerRef}
                  onActivate={handleActivate}
                  onClear={handleClear}
                  onPath={hasActive ? pathNodes.has(step.id) : undefined}
                />
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
