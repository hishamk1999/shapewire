import type {ReactNode} from 'react';
import HomepageHero from './HomepageHero';
import DataBoundary from './DataBoundary';
import Capabilities from './Capabilities';
import styles from './styles.module.css';

export default function Homepage(): ReactNode {
  return (
    <main className={styles.home}>
      <HomepageHero />
      <DataBoundary />
      <Capabilities />
    </main>
  );
}
