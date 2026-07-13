import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import {Highlight, themes} from 'prism-react-renderer';
import styles from './TransformationWorkbench.module.css';

const rawResponse = `const apiUser = {
  user_id: 7,
  full_name: 'Ada',
  balance: '12.50',
  verified: 'yes',
};`;

const transform = `const toUser = pipe(
  rename({
    user_id: 'id',
    full_name: 'name',
  }),
  defaults({ role: 'viewer' }),
  normalize({
    balance: 'number',
    verified: 'boolean',
  }),
);

const user = toUser(apiUser);`;

const applicationModel = `{
  id: 7,
  name: 'Ada',
  balance: 12.5,
  verified: true,
  role: 'viewer',
}`;

function WorkbenchPanel({
  step,
  title,
  code,
  emphasis = false,
}: {
  step: string;
  title: string;
  code: string;
  emphasis?: boolean;
}): ReactNode {
  return (
    <article className={emphasis ? styles.panelEmphasis : styles.panel}>
      <div className={styles.panelHeader}>
        <span>{step}</span>
        <h3>{title}</h3>
      </div>
      <Highlight theme={themes.dracula} code={code} language="typescript">
        {({className, style, tokens, getLineProps, getTokenProps}) => (
          <pre
            className={`${className} ${styles.panelCode}`}
            style={{...style, backgroundColor: 'transparent'}}
            tabIndex={0}
            aria-label={`${title} code example`}>
            <code>
              {tokens.map((line, lineIndex) => (
                <span {...getLineProps({line})} className={styles.codeLine} key={lineIndex}>
                  {line.map((token, tokenIndex) => (
                    <span {...getTokenProps({token})} key={tokenIndex} />
                  ))}
                </span>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </article>
  );
}

export default function TransformationWorkbench(): ReactNode {
  return (
    <section className={styles.workbench} aria-labelledby="workbench-title">
      <div className={styles.workbenchHeader}>
        <div>
          <p className={styles.workbenchEyebrow}>Transformation workbench</p>
          <Heading as="h2" id="workbench-title">
            One boundary. One reusable function.
          </Heading>
        </div>
        <ul className={styles.traits} aria-label="ShapeWire characteristics">
          <li>Immutable</li>
          <li>Synchronous</li>
          <li>Typed</li>
        </ul>
      </div>

      <div className={styles.flow}>
        <WorkbenchPanel step="01" title="API response" code={rawResponse} />
        <div className={styles.flowArrow} aria-hidden="true">
          <span />
        </div>
        <WorkbenchPanel step="02" title="ShapeWire pipeline" code={transform} emphasis />
        <div className={styles.flowArrow} aria-hidden="true">
          <span />
        </div>
        <WorkbenchPanel step="03" title="Application model" code={applicationModel} />
      </div>
    </section>
  );
}
