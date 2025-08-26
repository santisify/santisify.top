import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import AstroPureIntegration from 'astro-pure'
import { defineConfig } from 'astro/config'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

// Local integrations
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

// 完整的 KaTeX 配置
const katexOptions = {
  strict: false,
  throwOnError: false,
  trust: true,
  // 移除重复的希腊字母定义，只保留必要的自定义宏
  macros: {
    // 基本数学符号
    "\\RR": "\\mathbb{R}",
    "\\NN": "\\mathbb{N}",
    "\\ZZ": "\\mathbb{Z}",
    "\\QQ": "\\mathbb{Q}",
    "\\CC": "\\mathbb{C}",
    "\\HH": "\\mathbb{H}",
    "\\FF": "\\mathbb{F}",

    // 数学运算符
    "\\argmax": "\\operatorname*{argmax}",
    "\\argmin": "\\operatorname*{argmin}",
    "\\diag": "\\operatorname{diag}",
    "\\rank": "\\operatorname{rank}",
    "\\tr": "\\operatorname{tr}",
    "\\sgn": "\\operatorname{sgn}",
    "\\Span": "\\operatorname{Span}",
    "\\Var": "\\operatorname{Var}",
    "\\Cov": "\\operatorname{Cov}",
    "\\Corr": "\\operatorname{Corr}",
    "\\E": "\\mathbb{E}",
    "\\expect": "\\mathbb{E}",

    // 特殊函数
    "\\softmax": "\\operatorname{softmax}",
    "\\relu": "\\operatorname{ReLU}",
    "\\sigmoid": "\\operatorname{\\sigma}",
    "\\softplus": "\\operatorname{softplus}",
    "\\crossentropy": "\\operatorname{CE}",
    "\\kl": "D_{\\mathrm{KL}}",
    "\\entropy": "H",

    // 概率分布
    "\\normal": "\\mathcal{N}",
    "\\uniform": "\\mathcal{U}",
    "\\bernoulli": "\\mathrm{Bern}",
    "\\poisson": "\\mathrm{Poisson}",
    "\\binomial": "\\mathrm{Bin}",
    "\\exponential": "\\mathrm{Exp}",
    "\\gamma": "\\mathrm{Gamma}", // 注意：这里定义的是 Gamma 分布，不是希腊字母 gamma
    "\\beta": "\\mathrm{Beta}",   // 注意：这里定义的是 Beta 分布，不是希腊字母 beta
    "\\dirichlet": "\\mathrm{Dir}",

    // 矩阵操作
    "\\T": "^{\\mathsf{T}}",
    "\\top": "^{\\top}",
    "\\inv": "^{-1}",
    "\\pinv": "^{+}",
    "\\det": "\\operatorname{det}",

    // 集合论
    "\\emptyset": "\\varnothing",
    "\\set": "\\left\\{#1\\right\\}",
    "\\given": "\\mid",
    "\\suchthat": "\\mid",

    // 括号和分隔符
    "\\abs": "\\left|#1\\right|",
    "\\norm": "\\left\\|#1\\right\\|",
    "\\floor": "\\left\\lfloor#1\\right\\rfloor",
    "\\ceil": "\\left\\lceil#1\\right\\rceil",
    "\\round": "\\left[#1\\right]",
    "\\paren": "\\left(#1\\right)",
    "\\bracket": "\\left[#1\\right]",
    "\\brace": "\\left\\{#1\\right\\}",
    "\\angle": "\\left\\langle#1\\right\\rangle",

    // 微积分
    "\\dv": "\\frac{\\mathrm{d}#1}{\\mathrm{d}#2}",
    "\\pdv": "\\frac{\\partial #1}{\\partial #2}",
    "\\odv": "\\frac{\\mathrm{d}#1}{\\mathrm{d}#2}",
    "\\ddv": "\\frac{\\mathrm{d}^2#1}{\\mathrm{d}#2^2}",
    "\\pddv": "\\frac{\\partial^2 #1}{\\partial #2 \\partial #3}",
    "\\int": "\\int\\limits_{#1}^{#2}",
    "\\iint": "\\iint\\limits_{#1}^{#2}",
    "\\iiint": "\\iiint\\limits_{#1}^{#2}",
    "\\oint": "\\oint\\limits_{#1}",
    "\\eval": "\\left.#1\\right|_{#2}",

    // 向量和矩阵
    "\\vec": "\\overrightarrow{#1}",
    "\\mat": "\\begin{pmatrix} #1 \\end{pmatrix}",
    "\\bmat": "\\begin{bmatrix} #1 \\end{bmatrix}",
    "\\pmat": "\\begin{pmatrix} #1 \\end{pmatrix}",
    "\\vmat": "\\begin{vmatrix} #1 \\end{vmatrix}",

    // 求和和乘积
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

    // 逻辑和集合操作
    "\\implies": "\\Rightarrow",
    "\\impliedby": "\\Leftarrow",
    "\\iff": "\\Leftrightarrow",
    "\\forall": "\\forall",
    "\\exists": "\\exists",
    "\\nexists": "\\nexists",
    "\\in": "\\in",
    "\\notin": "\\notin",
    "\\subset": "\\subset",
    "\\supset": "\\supset",
    "\\subseteq": "\\subseteq",
    "\\supseteq": "\\supseteq",
    "\\cup": "\\cup",
    "\\cap": "\\cap",
    "\\setminus": "\\setminus",

    // 其他常用符号
    "\\degree": "^{\\circ}",
    "\\indicator": "\\mathbb{1}",
    "\\x": "\\times",
    "\\dot": "\\cdot",
    "\\bd": "\\mathbf",
    "\\cal": "\\mathcal",
    "\\frak": "\\mathfrak",

    // 计算机科学相关
    "\\bigO": "\\mathcal{O}",
    "\\bigTheta": "\\Theta",
    "\\bigOmega": "\\Omega",
    "\\smallO": "o",
    "\\smallOmega": "\\omega",
    "\\softO": "\\widetilde{O}"
  }
};

// https://astro.build/config
export default defineConfig({
  vite: {
    build: {
      minify: 'terser',
      cssMinify: true
    },
    optimizeDeps: {
      include: ['katex']
    }
  },
  site: 'https://santisify.top',
  trailingSlash: 'never',
  output: 'static',
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
    domains: ['ghchart.rshah.org']
  },
  integrations: [AstroPureIntegration(config)],
  prefetch: true,
  server: {
    host: true
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      rehypeHeadingIds,
      [rehypeKatex, katexOptions],
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
        addCopyButton(2000)
      ]
    }
  },
  experimental: {
    contentIntellisense: true
  }
})
