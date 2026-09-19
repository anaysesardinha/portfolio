import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
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
          Technical writer for fintech & payments APIs
          <span className={styles.cursor} aria-hidden="true">
            |
          </span>
        </p>
        <p className={styles.heroLede}>
          I write API documentation for fintech and payments platforms,
          and I build the tooling around it: docs-as-code pipelines,
          reviewer automations, and AI-native integrations that make
          documentation teams faster.
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
      description="Technical writing portfolio built docs-as-code with Docusaurus.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
