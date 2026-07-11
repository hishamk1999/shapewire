import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'ShapeWire',
  tagline: 'Type-safe pipelines for turning API responses into UI-ready data',
  future: {
    v4: true,
  },
  url: 'http://localhost',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'ShapeWire',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          to: '/docs/api/pipe',
          label: 'API',
          position: 'left',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Start',
          items: [
            {label: 'Overview', to: '/docs/intro'},
            {label: 'Installation', to: '/docs/getting-started/installation'},
            {label: 'Quick start', to: '/docs/getting-started/quick-start'},
          ],
        },
        {
          title: 'Reference',
          items: [
            {label: 'API', to: '/docs/api/pipe'},
            {label: 'Guides', to: '/docs/guides/api-to-ui'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ShapeWire. Built with Docusaurus.`,
    },
    prism: {
      additionalLanguages: ['bash'],
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
