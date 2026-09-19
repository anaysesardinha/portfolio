import type {ReactNode} from 'react';

type IconProps = React.ComponentProps<'svg'>;

const commonProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function DocsAsCodeIcon(props: IconProps): ReactNode {
  return (
    <svg {...commonProps} {...props}>
      <polyline points="9,6 3,12 9,18" />
      <polyline points="15,6 21,12 15,18" />
    </svg>
  );
}

export function PlaygroundIcon(props: IconProps): ReactNode {
  return (
    <svg {...commonProps} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <polygon points="10,12.5 10,17.5 15,15" />
    </svg>
  );
}

export function ReviewIcon(props: IconProps): ReactNode {
  return (
    <svg {...commonProps} {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 3h6v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z" />
      <polyline points="8.5,13 10.5,15 15.5,10" />
    </svg>
  );
}
