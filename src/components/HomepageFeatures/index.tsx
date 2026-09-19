import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Docs-as-Code',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        I write content in Markdown/MDX, version it in Git, review it
        through pull requests, and ship it through CI/CD: the same
        workflow engineers use for code.
      </>
    ),
  },
  {
    title: 'Multi-Tool Fluency',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        I work comfortably across documentation platforms, including
        Mintlify, Docusaurus, and MkDocs, and pick the right tool for the
        project instead of forcing one stack everywhere.
      </>
    ),
  },
  {
    title: 'Clear, Cross-Cultural Communication',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        I write and review docs for global audiences and clients, with an
        eye for clarity, structure, and accessibility.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
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
