import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import styles from './DataBoundary.module.css';

export default function DataBoundary(): ReactNode {
  return (
    <section className={styles.boundary} aria-labelledby="boundary-title">
      <div className="container">
        <div className={styles.boundaryGrid}>
          <div>
            <p className={styles.sectionLabel}>The transformation layer</p>
            <Heading as="h2" id="boundary-title">
              Your data boundary, made explicit.
            </Heading>
          </div>
          <div className={styles.boundaryCopy}>
            <p>
              APIs optimize data for transport. Applications need stable shapes. ShapeWire
              cleans, reshapes, filters, fills, merges, and maps data before it reaches UI,
              state, services, or server code.
            </p>
            <p className={styles.boundaryNote}>
              It transforms data. It does not fetch it, render UI, validate business rules, or
              require a state library.
            </p>
          </div>
        </div>

        <div className={styles.runtimeLine}>
          <strong>Use the same plain function anywhere JavaScript runs.</strong>
          <ul aria-label="Compatible environments">
            <li>React</li>
            <li>Vue</li>
            <li>Svelte</li>
            <li>Node.js</li>
            <li>Workers</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
