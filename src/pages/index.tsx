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
        <p className={styles.heroLede}>
          I'm a technical writer who builds the tooling that writers and
          SMEs rely on. I spent over a decade teaching languages, always
          focused on making complex material clear in English and
          Portuguese. That instinct for learning design still drives my
          work today, even as the medium has evolved.
        </p>
        <p className={styles.heroLede}>
          I currently manage documentation for multiple clients across
          SaaS, developer platforms, and operations teams. I write the
          guides and API references, and also the systems behind them.
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
