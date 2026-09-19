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
        Write and manage docs in Markdown/MDX under Git version control.
        Ship changes through pull request review and CI/CD pipelines.
        Documentation receives the same rigorous workflows engineers use
        for code.
      </>
    ),
  },
  {
    title: 'API Docs & Interactive Tooling',
    Icon: PlaygroundIcon,
    description: (
      <>
        Generate API references straight from OpenAPI specs. Configure
        interactive playgrounds for direct API testing. Custom MCP
        integrations allow AI coding assistants to query the docs
        seamlessly.
      </>
    ),
  },
  {
    title: 'AI-Native Review & Quality',
    Icon: ReviewIcon,
    description: (
      <>
        Implement automated rulesets and AI agents. These agents
        validate content, API writing, and code samples using
        consistency scoring models. Automated link validation and SEO
        checks run on every pull request.
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
