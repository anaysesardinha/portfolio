import React, {
  useCallback,
  useEffect,
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
  children?: DiagramNode[];
};

type LineCoord = {x1: number; y1: number; x2: number; y2: number};

// Matches .card's max-width and .childrenRow's gap in styles.module.css.
// Used to estimate how much room a leaf sibling needs, without waiting on
// a measurement pass.
const CARD_MAX_WIDTH = 210;
const ROW_GAP = 20;

// useLayoutEffect warns during server-side rendering. This falls back to
// a no-op effect on the server and the real thing in the browser.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function isLeaf(node: DiagramNode): boolean {
  return !node.children || node.children.length === 0;
}

function collectEdges(
  node: DiagramNode,
  edges: Array<{parent: string; child: string}> = [],
): Array<{parent: string; child: string}> {
  node.children?.forEach((child) => {
    edges.push({parent: node.id, child: child.id});
    collectEdges(child, edges);
  });
  return edges;
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
): void {
  if (!node.children || node.children.length === 0) {
    return;
  }
  budgets.set(node.id, availableWidth);
  if (node.children.every(isLeaf)) {
    return;
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
    computeRowBudgets(child, perBranchWidth, budgets),
  );
}

function Card({
  node,
  registerRef,
}: {
  node: DiagramNode;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
}): ReactNode {
  return (
    <div
      className={styles.cardWrapper}
      ref={(el) => registerRef(node.id, el)}>
      <Link
        to={node.href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.card}>
        <span className={styles.cardLabel}>
          {node.label}
          <span className={styles.cardIcon} aria-hidden="true">
            ↗
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
}: {
  node: DiagramNode;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  rowBudgets: Map<string, number>;
}): ReactNode {
  // Wrapping a row onto multiple lines is only safe when every child in it
  // is a leaf. Wrapping a row that mixes a leaf with a branch (a child that
  // has its own children) pushes them onto separate lines and makes true
  // siblings look like a parent-child chain instead of a fork.
  const allChildrenAreLeaves = node.children?.every(isLeaf);
  const budget = rowBudgets.get(node.id);
  const rowStyle =
    allChildrenAreLeaves && budget ? {maxWidth: budget} : undefined;

  return (
    <div className={styles.branch}>
      <Card node={node} registerRef={registerRef} />
      {node.children && node.children.length > 0 && (
        <div
          style={rowStyle}
          className={
            allChildrenAreLeaves
              ? `${styles.childrenRow} ${styles.childrenRowWrap}`
              : styles.childrenRow
          }>
          {node.children.map((child) => (
            <Branch
              key={child.id}
              node={child}
              registerRef={registerRef}
              rowBudgets={rowBudgets}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeDiagram({data}: {data: DiagramNode}): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLDivElement>());
  const [lines, setLines] = useState<LineCoord[]>([]);
  const [containerWidth, setContainerWidth] = useState<number>();

  const registerRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      nodeRefs.current.set(id, el);
    } else {
      nodeRefs.current.delete(id);
    }
  }, []);

  const recompute = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const containerRect = container.getBoundingClientRect();
    setContainerWidth(container.clientWidth);
    const edges = collectEdges(data);
    const nextLines = edges
      .map(({parent, child}) => {
        const parentEl = nodeRefs.current.get(parent);
        const childEl = nodeRefs.current.get(child);
        if (!parentEl || !childEl) {
          return null;
        }
        const p = parentEl.getBoundingClientRect();
        const c = childEl.getBoundingClientRect();
        return {
          x1: p.left + p.width / 2 - containerRect.left,
          y1: p.bottom - containerRect.top,
          x2: c.left + c.width / 2 - containerRect.left,
          y2: c.top - containerRect.top,
        };
      })
      .filter((line): line is LineCoord => line !== null);
    setLines(nextLines);
  }, [data]);

  useIsomorphicLayoutEffect(() => {
    recompute();
    if (typeof ResizeObserver === 'undefined' || !containerRef.current) {
      return undefined;
    }
    const observer = new ResizeObserver(() => recompute());
    observer.observe(containerRef.current);
    window.addEventListener('resize', recompute);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', recompute);
    };
  }, [recompute]);

  const rowBudgets = useMemo(() => {
    const budgets = new Map<string, number>();
    if (containerWidth) {
      computeRowBudgets(data, containerWidth, budgets);
    }
    return budgets;
  }, [data, containerWidth]);

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <svg className={styles.connectors}>
        {lines.map((line, index) => {
          const midY = (line.y1 + line.y2) / 2;
          const path = `M ${line.x1} ${line.y1} C ${line.x1} ${midY}, ${line.x2} ${midY}, ${line.x2} ${line.y2}`;
          return <path key={index} d={path} className={styles.connectorPath} />;
        })}
      </svg>
      <Branch node={data} registerRef={registerRef} rowBudgets={rowBudgets} />
    </div>
  );
}
