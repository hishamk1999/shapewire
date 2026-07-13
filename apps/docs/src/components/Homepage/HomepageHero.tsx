import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import TransformationWorkbench from './TransformationWorkbench';
import styles from './HomepageHero.module.css';

export default function HomepageHero(): ReactNode {
  return (
    <header className={styles.hero}>
      <div className="container">
        <div className={styles.heroIntro}>
          <div>
            <p className={styles.eyebrow}>
              <span aria-hidden="true" /> Framework-agnostic · TypeScript-first
            </p>
            <Heading as="h1">Shape API data for the code that uses it.</Heading>
          </div>
          <div className={styles.heroSummary}>
            <p>
              ShapeWire is a type-safe transformation layer between external data and your
              application. Turn inconsistent responses into clean models with small functions
              that compose.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryAction} to="/docs/getting-started/quick-start">
                Get started <span aria-hidden="true">→</span>
              </Link>
              <Link className={styles.secondaryAction} to="/docs/api/pipe">
                Explore the API
              </Link>
            </div>
          </div>
        </div>

        <TransformationWorkbench />
      </div>
    </header>
  );
}
