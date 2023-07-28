import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import starlight from '@astrojs/starlight';

import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    markdoc(),
    starlight({
      title: 'Exo UI',
      social: {
        github: 'https://github.com/chopfitzroy/exo-ui',
      },
      sidebar: [
        {
          label: 'Getting started',
          items: [
            { label: 'Introduction', link: '/overview/introduction/' },
            { label: 'Philosophies', link: '/overview/philosophies/' },
          ]
        },
        {
          label: 'Components',
          autogenerate: { directory: 'components' },
        },
        {
          label: 'Examples',
          autogenerate: { directory: 'examples' },
        },
        {
          label: 'Tutorials',
          items: [
            { label: 'Extending provider fields', link: '/tutorials/extending-provider-fields/' },
            { label: 'Adding custom actions to fields', link: '/tutorials/adding-custom-actions-to-fields/' },
            { label: 'Using hooks in the same file as providers', link: '/tutorials/using-hooks-in-the-same-file-as-providers/' },
          ]
        },
      ],
      customCss: [
        './src/components/Editor.css'
      ]
    }),
  ],

  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
