import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import RecentBuilds from '@site/src/components/RecentBuilds';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className={clsx('container', styles.heroInner)}>
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroRole}>
          Technical writer for SaaS, dev docs & operations
          <span className={styles.cursor} aria-hidden="true">
            |
          </span>
        </p>
        <div className={styles.actions}>
          <Link
            className={clsx(styles.button, styles.buttonPrimary)}
            to="/docs/intro">
            Read the docs
          </Link>
          <Link
            className={clsx(styles.button, styles.buttonGhost)}
            to="/docs/meridian-logistics/about-this-sample">
            View sample: Meridian Contract Logistics
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Technical writing portfolio using docs-as-code with Docusaurus.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <RecentBuilds />
      </main>
    </Layout>
  );
}
