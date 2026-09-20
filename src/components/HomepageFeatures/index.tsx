import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import {DocsAsCodeIcon, PlaygroundIcon, ReviewIcon} from './icons';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Icon: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Docs-as-Code',
    Icon: DocsAsCodeIcon,
    description: (
      <>
        Documentation treated like software. Authored in Markdown, managed in Git, and deployed via CI/CD.
      </>
    ),
  },
  {
    title: 'Interactive API Docs',
    Icon: PlaygroundIcon,
    description: (
      <>
        Auto-generated from OpenAPI specs with built-in playgrounds for direct testing and AI integration.
      </>
    ),
  },
  {
    title: 'Automated Quality',
    Icon: ReviewIcon,
    description: (
      <>
        AI agents and automated rules validate links, SEO, and content consistency on every pull request.
      </>
    ),
  },
];

function Feature({title, Icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.iconWrap}>
          <Icon className={styles.icon} role="img" />
        </div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <Heading as="h2">Principles this site is built on</Heading>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}