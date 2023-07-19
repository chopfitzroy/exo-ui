import { defineMarkdocConfig, component, nodes } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  tags: {
    editor: {
      render: component('./src/components/Editor.astro'),
      attributes: {
        files: { type: Array },
      },
    },
  },
  nodes: {
    document: {
      ...nodes.document,
      // @NOTE
      // - Disable default `article` element
      // - If this is enabled it breaks the default typography styles
      // - https://docs.astro.build/en/guides/integrations-guide/markdoc/#set-the-root-html-element
      render: null,
    },
  },
});