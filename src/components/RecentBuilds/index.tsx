import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type BuildItem = {
  title: string;
  description: ReactNode;
};

const BuildList: BuildItem[] = [
  {
    title: 'AI-native reviewer skills',
    description: (
      <>
        A suite of Claude Code tools handling meeting ingestion, content
        validation, API review, code sample checks, and translation. It's
        built on Diátaxis and plain language principles and uses a scoring
        model to keep writers consistent.
      </>
    ),
  },
  {
    title: 'Interactive API tooling',
    description: (
      <>
        Developer playgrounds built into the docs let users test API flows
        directly instead of just reading static references.
      </>
    ),
  },
  {
    title: 'MCP server integrations',
    description: (
      <>
        Infrastructure for developer portals that lets AI coding assistants
        query and retrieve docs directly.
      </>
    ),
  },
  {
    title: 'Automated quality pipelines',
    description: (
      <>
        CI/CD workflows running broken link checks and SEO validation on
        every pull request to catch issues before they reach production.
      </>
    ),
  },
  {
    title: 'Client reporting dashboards',
    description: (
      <>
        Automated visibility tools ranging from Slack-ready status updates
        to interactive HTML dashboards. They keep stakeholders aligned on
        project health.
      </>
    ),
  },
];

function Build({title, description}: BuildItem) {
  return (
    <div className={styles.item}>
      <Heading as="h3" className={styles.itemTitle}>
        {title}
      </Heading>
      <p className={styles.itemDescription}>{description}</p>
    </div>
  );
}

export default function RecentBuilds(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <Heading as="h2" className={styles.heading}>
            Recent builds
          </Heading>
          {BuildList.map((props, idx) => (
            <Build key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
