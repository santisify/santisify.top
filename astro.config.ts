import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import AstroPureIntegration from 'astro-pure'
import { defineConfig } from 'astro/config'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

// Local integrations
// Local rehype & remark plugins
import rehypeAutolinkHeadings from './src/plugins/rehype-auto-link-headings.ts'
// Shiki
import {
  addCopyButton,
  addLanguage,
  addTitle,
  transformerNotationDiff,
  transformerNotationHighlight,
  updateStyle
} from './src/plugins/shiki-transformers.ts'
import config from './src/site.config.ts'

// https://astro.build/config
export default defineConfig({
  vite: {
    build: {
      minify: 'terser', // 启用 JS/CSS 压缩
      cssMinify: true // 确保 CSS 压缩开启
    }
  },
  // Top-Level Options
  site: 'https://santisify.top',
  // base: '/docs',
  trailingSlash: 'never',

  // Adapter
  // https://docs.astro.build/en/guides/deploy/
  // 1. Vercel (serverless)
  // adapter: vercel(),
  output: 'static',
  // 2. Vercel (static)
  // adapter: vercelStatic(),
  // 3. Local (standalone)
  // adapter: node({ mode: 'standalone' }),
  // output: 'server',
  // ---

  image: { service: { entrypoint: 'astro/assets/services/sharp' }, domains: ['ghchart.rshah.org'] },

  integrations: [
    // astro-pure will automatically add sitemap, mdx & unocss
    // sitemap(),
    // mdx(),
    AstroPureIntegration(config)
    // (await import('@playform/compress')).default({ SVG: false, Exclude: ['index.*.js'] })
    // Temporary fix vercel adapter
    // static build method is not needed
  ],
  // root: './my-project-directory',

  // Prefetch Options
  prefetch: true,
  // Server Options
  server: {
    host: true
  },
  // Markdown Options - 添加 LaTeX 支持
  markdown: {
    // 添加 remark-math 插件
    remarkPlugins: [
      remarkMath // 处理数学公式
      // 其他 remark 插件...
    ],

    rehypePlugins: [
      rehypeHeadingIds,
      // 添加 rehype-katex 插件 (在标题链接之前)
      [
        rehypeKatex,
        {
          // KaTeX 配置选项
          output: 'html',
          strict: false,
          fleqn: false,
          throwOnError: true,
          errorColor: '#cc0000',
          macros: {
            '\\RR': '\\mathbb{R}',
            '\\CC': '\\mathbb{C}',
            '\\NN': '\\mathbb{N}',
            '\\ZZ': '\\mathbb{Z}',
            '\\QQ': '\\mathbb{Q}'
          }
        }
      ],
      // 标题链接插件
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
        transformerNotationDiff(),
        transformerNotationHighlight(),
        updateStyle(),
        addTitle(),
        addLanguage(),
        addCopyButton(2000),
        // 添加数学公式处理排除
        {
          name: 'exclude-math',
          root(node) {
            // 跳过包含数学公式的代码块
            if (
              node.children.some(
                (child) =>
                  child.type === 'text' && (child.value.includes('$') || child.value.includes('\\'))
              )
            ) {
              return false
            }
            return
          }
        }
      ]
    }
  },
  experimental: {
    contentIntellisense: true
  }
})
