import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import styles from './index.module.css';

function HomepageHeader(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <p className={styles.eyebrow}>API data in. UI-ready data out.</p>
        <Heading as="h1" className="hero__title">{siteConfig.title}</Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/getting-started/quick-start">
            Get started
          </Link>
          <Link className="button button--outline button--secondary button--lg" to="/docs/api/pipe">
            Explore the API
          </Link>
        </div>
        <pre className={styles.codeSample} aria-label="Transformation example"><code>{`pipe(
  rename({ user_id: 'id' }),
  defaults({ role: 'viewer' }),
  normalize({ balance: 'number' }),
)`}</code></pre>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout title="Type-safe data transforms" description="Shape API responses into clean, typed UI data with composable transforms.">
      <HomepageHeader />
      <main><HomepageFeatures /></main>
    </Layout>
  );
}
