import markdoc from '@astrojs/markdoc';
import starlight from '@astrojs/starlight';

import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [
    markdoc(),
    starlight({
      title: 'Exo UI',
      social: {
        github: 'https://github.com/chopfitzroy/exo-ui',
      },
      sidebar: [
        {
          label: 'Components',
          items: [
            // Each item here is one entry in the navigation menu.
            { label: 'Single select list', link: '/guides/example/' },
            { label: 'Multi select list', link: '/guides/example/' },
            { label: 'Pagination', link: '/guides/example/' },
            { label: 'Carousel', link: '/guides/example/' },
            { label: 'Toggle', link: '/guides/example/' },
            { label: 'Toast', link: '/guides/example/' },
          ],
        },
        {
          label: 'Examples',
          autogenerate: { directory: 'reference' },
        },
      ],
    }),
  ],

  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
