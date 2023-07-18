import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  tags: {
    editor: {
      render: component('./src/components/Editor.astro'),
      attributes: {
        // type: { type: String },
      },
    },
  },
});