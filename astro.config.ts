import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import AstroPureIntegration from 'astro-pure'
import { defineConfig, fontProviders } from 'astro/config'

// Local integrations
import rehypeAutolinkHeadings from './src/plugins/rehype-auto-link-headings.ts'
import {
  addCollapse,
  addCopyButton,
  addLanguage,
  addTitle,
  updateStyle
} from './src/plugins/shiki-custom-transformers.ts'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerRemoveNotationEscape
} from './src/plugins/shiki-offical/transformers.ts'
import config from './src/site.config.ts'

// https://astro.build/config
export default defineConfig({
  site: 'https://santisify.top',
  trailingSlash: 'never',
  output: 'static',
  image: {
    responsiveStyles: true,
    service: { entrypoint: 'astro/assets/services/sharp' },
    domains: ['ghchart.rshah.org']
  },
  integrations: [AstroPureIntegration(config)],
  prefetch: true,
  server: {
    host: true
  },
  markdown: {
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['anchor'] },
          content: { type: 'text', value: '#' }
        }
      ]
    ],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      transformers: [
        // Official transformers
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerRemoveNotationEscape(),
        // Custom transformers
        updateStyle(),
        addTitle(),
        addLanguage(),
        addCopyButton(2000), // timeout in ms
        addCollapse(15) // max lines that needs to collapse
      ]
    }
  },
  experimental: {
    // Allow compatible editors to support intellisense features for content collection entries
    // https://docs.astro.build/en/reference/experimental-flags/content-intellisense/
    contentIntellisense: true,
    // Enable SVGO optimization for SVG assets
    // https://docs.astro.build/en/reference/experimental-flags/svg-optimization/
    svgo: true,
    // Enable font preloading and optimization
    // https://docs.astro.build/en/reference/experimental-flags/fonts/
    fonts: [
      {
        provider: fontProviders.fontshare(),
        name: 'Satoshi',
        cssVariable: '--font-satoshi',
        // Default included:
        // weights: [400],
        // styles: ["normal", "italics"],
        // subsets: ["cyrillic-ext", "cyrillic", "greek-ext", "greek", "vietnamese", "latin-ext", "latin"],
        // fallbacks: ["sans-serif"],
        styles: ['normal', 'italic'],
        weights: [400, 500],
        subsets: ['latin']
      }
    ]
  }
})
