import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Homepage from '@site/src/components/Homepage';

export default function Home(): ReactNode {
  return (
    <Layout
      title="Framework-agnostic data transforms"
      description="ShapeWire is a framework-agnostic, type-safe transformation layer for turning API responses into clean application data.">
      <Homepage />
    </Layout>
  );
}
