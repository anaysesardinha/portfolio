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
        I write content in Markdown/MDX, version it in Git, review it
        through pull requests, and ship it through CI/CD: the same
        workflow engineers use for code.
      </>
    ),
  },
  {
    title: 'API Docs & Interactive Tooling',
    Icon: PlaygroundIcon,
    description: (
      <>
        I write API references from OpenAPI specs and build interactive
        playgrounds so developers can test flows directly from the docs,
        plus MCP integrations so AI coding assistants can query
        documentation instead of developers searching manually.
      </>
    ),
  },
  {
    title: 'AI-Native Review & Quality Tooling',
    Icon: ReviewIcon,
    description: (
      <>
        I build reviewer skills for content validation, API writing, and
        code samples, backed by a scoring model for consistency, plus
        automated link and SEO checks on every documentation pull request.
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
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
