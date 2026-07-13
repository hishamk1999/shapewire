import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import styles from './Capabilities.module.css';

const capabilities = [
  {
    title: 'Shape objects',
    description:
      'Rename, pick, omit, default, merge, or target a nested object without changing the source response.',
    tools: 'rename · pick · omit · defaults · merge · at',
  },
  {
    title: 'Normalize values',
    description:
      'Turn inconsistent dates, numbers, booleans, currencies, and domain values into predictable types.',
    tools: 'normalize · built-ins · custom callbacks',
  },
  {
    title: 'Compose once',
    description:
      'Build one readable transform, reuse it for objects or lists, and keep transport details out of application code.',
    tools: 'pipe · mapEach · inferred output',
  },
] as const;

export default function Capabilities(): ReactNode {
  return (
    <section className={styles.capabilities} aria-labelledby="capabilities-title">
      <div className="container">
        <div className={styles.capabilityHeading}>
          <p className={styles.sectionLabel}>Small pieces, useful together</p>
          <Heading as="h2" id="capabilities-title">
            Handle the messy parts once.
          </Heading>
        </div>
        <div className={styles.capabilityGrid}>
          {capabilities.map(({title, description, tools}) => (
            <article className={styles.capability} key={title}>
              <Heading as="h3">{title}</Heading>
              <p>{description}</p>
              <code>{tools}</code>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
