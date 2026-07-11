import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const features = [
  ['Declarative', 'Describe renames, defaults, and formats as data instead of repeating mapping code.'],
  ['Type-safe', 'Carry inferred output types through a readable left-to-right pipeline.'],
  ['UI-ready', 'Handle nulls, inconsistent primitives, lists, and merged sources before rendering.'],
] as const;

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {features.map(([title, description]) => (
            <div className="col col--4" key={title}>
              <article className={styles.card}>
                <Heading as="h2">{title}</Heading>
                <p>{description}</p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
