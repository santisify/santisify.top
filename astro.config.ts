import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import AstroPureIntegration from 'astro-pure'
import { defineConfig } from 'astro/config'

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

// 导入 LaTeX 支持所需的插件
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// 导入 KaTeX 扩展以支持更多功能
import katex from 'katex';

// 确保 KaTeX 加载所有必要的扩展
// 这些扩展提供了对更多 LaTeX 命令的支持
const katexOptions = {
  // 启用所有信任选项以支持更多命令
  trust: true,
  // 启用严格模式以捕获更多错误
  strict: false,
  // 添加宏定义以支持更多 LaTeX 命令
  macros: {
    "\\RR": "\\mathbb{R}",
    "\\bold": "\\mathbf",
    "\\x": "\\times",
    "\\diag": "\\operatorname{diag}",
    "\\sgn": "\\operatorname{sgn}",
    "\\tr": "\\operatorname{tr}",
    "\\rank": "\\operatorname{rank}",
    "\\Span": "\\operatorname{Span}",
    "\\argmin": "\\operatorname*{argmin}",
    "\\argmax": "\\operatorname*{argmax}",
    "\\softmax": "\\operatorname{softmax}",
    "\\relu": "\\operatorname{ReLU}",
    "\\sigmoid": "\\operatorname{\\sigma}",
    "\\softplus": "\\operatorname{softplus}",
    "\\crossentropy": "\\operatorname{CE}",
    "\\kl": "D_{\\mathrm{KL}}",
    "\\entropy": "H",
    "\\var": "\\operatorname{Var}",
    "\\cov": "\\operatorname{Cov}",
    "\\corr": "\\operatorname{Corr}",
    "\\normal": "\\mathcal{N}",
    "\\uniform": "\\mathcal{U}",
    "\\bernoulli": "\\mathrm{Bern}",
    "\\poisson": "\\mathrm{Poisson}",
    "\\binomial": "\\mathrm{Bin}",
    "\\expect": "\\mathbb{E}",
    "\\indicator": "\\mathbb{1}",
    "\\given": "\\mid",
    "\\T": "^{\\mathsf{T}}",
    "\\inv": "^{-1}",
    "\\pinv": "^{+}",
    "\\top": "^{\\top}",
    "\\bottom": "\\bot",
    "\\vec": "\\overrightarrow",
    "\\abs": "\\left|#1\\right|",
    "\\norm": "\\left\\|#1\\right\\|",
    "\\floor": "\\left\\lfloor#1\\right\\rfloor",
    "\\ceil": "\\left\\lceil#1\\right\\lceil",
    "\\round": "\\left[#1\\right]",
    "\\set": "\\left\\{#1\\right\\}",
    "\\paren": "\\left(#1\\right)",
    "\\bracket": "\\left[#1\\right]",
    "\\brace": "\\left\\{#1\\right\\}",
    "\\angle": "\\left\\langle#1\\right\\rangle",
    "\\eval": "\\left.#1\\right|_{#2}",
    "\\pdv": "\\frac{\\partial #1}{\\partial #2}",
    "\\dv": "\\frac{\\mathrm{d}#1}{\\mathrm{d}#2}",
    "\\odv": "\\frac{\\mathrm{d}#1}{\\mathrm{d}#2}",
    "\\pddv": "\\frac{\\partial^2 #1}{\\partial #2 \\partial #3}",
    "\\ddv": "\\frac{\\mathrm{d}^2#1}{\\mathrm{d}#2^2}",
    "\\oddv": "\\frac{\\mathrm{d}^2#1}{\\mathrm{d}#2^2}",
    "\\int": "\\int\\limits_{#1}^{#2}",
    "\\iint": "\\iint\\limits_{#1}^{#2}",
    "\\iiint": "\\iiint\\limits_{#1}^{#2}",
    "\\oint": "\\oint\\limits_{#1}",
    "\\sum": "\\sum\\limits_{#1}^{#2}",
    "\\prod": "\\prod\\limits_{#1}^{#2}",
    "\\coprod": "\\coprod\\limits_{#1}^{#2}",
    "\\bigcup": "\\bigcup\\limits_{#1}^{#2}",
    "\\bigcap": "\\bigcap\\limits_{#1}^{#2}",
    "\\bigsqcup": "\\bigsqcup\\limits_{#1}^{#2}",
    "\\bigvee": "\\bigvee\\limits_{#1}^{#2}",
    "\\bigwedge": "\\bigwedge\\limits_{#1}^{#2}",
    "\\bigodot": "\\bigodot\\limits_{#1}^{#2}",
    "\\bigotimes": "\\bigotimes\\limits_{#1}^{#2}",
    "\\bigoplus": "\\bigoplus\\limits_{#1}^{#2}",
    "\\biguplus": "\\biguplus\\limits_{#1}^{#2}",
  },
  // 启用所有扩展
  // 注意：某些扩展可能需要额外配置
};

// https://astro.build/config
export default defineConfig({
  vite: {
    build: {
      minify: 'terser', // 启用 JS/CSS 压缩
      cssMinify: true // 确保 CSS 压缩开启
    },
    // 确保 KaTeX 正确打包
    optimizeDeps: {
      include: ['katex']
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
  // Markdown Options - 添加完整的 LaTeX 支持
  markdown: {
    remarkPlugins: [
      remarkMath, // 添加数学公式支持
    ],
    rehypePlugins: [
      rehypeHeadingIds,
      [rehypeKatex, katexOptions], // 添加 KaTeX 支持并传递选项
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['anchor'] },
          content: { type: 'text', value: '#' }
        }
      ]
    ],
    // https://docs.astro.build/en/guides/syntax-highlighting/
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
        addCopyButton(2000)
      ]
    }
  },
  experimental: {
    contentIntellisense: true
  }
})
