---
title: LaTex
tags: [ '分享' ]
publishDate: '2025-02-13'
description: 'LaTex 下书写数学公式、表达式以及各种数学符号'
heroImage: { src: './iv/LaTeX_project_logo_bird.svg', color: '#4891B2' }
language: 'zh-cn'
---


# LaTex 下书写数学公式、表达式以及各种数学符号

## Table of Contents

*   [什么是 LaTex](#orgf4fa175)
*   [如何使用 Latex 写数学符号](#org69cb57c)
*   [数学符号](#orga792cdd)
*   [Functions](#orgd29656b)
*   [希腊字母](#org56443c6)
*   [向量](#org7b3d713)
*   [集合](#org2bda6eb)
*   [逻辑](#orge64023a)
*   [微积分](#org6272b34)
*   [三角函数](#org7a11eae)
*   [其他](#org332d9aa)
		*   [cases](#orgd675dc2)
		*   [公式换行、对齐](#org19b1b02)
		*   [substack](#org1138c42)
		*   [matrix](#orgdcee25d)
*   [最后](#org2eaa390)
*   [Ref:](#org83a746c)

## 什么是 LaTex

Latex 是一个用于书写以及排版的计算机语言。它在写数学符号和公式方面尤其方便。

## 如何使用 Latex 写数学符号

在 Latex 中有三种方法来写数学符号：

1.  行内(inline)形式（符号以及公式夹杂在文本的中间，例如这样 \\(E=mc^2\\) ）
2.  独立的一行(equation)

    \\begin{equation} x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a} \\end{equation}
3.  full-sized 行内表达式（通过 displaystyle） 为了得到这种形式的表达式需要使用 \\displaystyle。 例如： `I want this $\displaystyle \sum_{n=1}^{\infty}\frac{1}{n}$ ,not this $\sum_{n=1}^{\infty} \frac{1}{n}`, I want this \\(\\displaystyle \\sum\_{n=1}^{\\infty}\\frac{1}{n}\\) ,not this \\(\\sum\_{n=1}^{\\infty} \\frac{1}{n}\\) 。

## 数学符号

下面是比较常用的一些：


| 描述 | 命令 | 输出 |
| --- | --- | --- |
| addition | + | \\(+\\) |
| subtraction | \- | \\(-\\) |
| plus or minus | `\pm` | \\(\\pm\\) |
| multiplication(times) | `\times` | \\(\\times\\) |
| multiplication(dot) | `\cdot` | \\(cdot\\) |
| division symbol | `\div` | \\(\\div\\) |
| division(slash) | `/` | \\(/\\) |
| simple text | `\text{text}` | \\(\\text{text}\\) |
| infinity | `\infty` | \\(\\infty\\) |
| dots | `1,2,3,\ldots` | \\(1,2,3,\\ldots\\) |
| dots | `1+2+3+\cdots` | \\(1+2+3+\\cdots\\) |
| fraction | `\frac{a}{b}` | \\(\\frac{a}{b}\\) |
| nth root | `\sqrt[n]{x}` | \\(\\sqrt\[n\]{x}\\) |
| square root | `\sqrt{x}` | \\(\\sqrt{x}\\) |
| exponentiation | `a^b` | \\(a^b\\) |
| subscript | `a_b` | \\(a\_b\\) |
| natural log | `\ln(x)` | \\(\\ln(x)\\) |
| logarithms | `\log_{a}b` | \\(\\log\_{a}b\\) |
| exp | `\exp` | \\(\\exp\\) |
| deg | `\deg(f)` | \\(deg(f)\\) |
| arcmin | `^\prime` | \\(^\\prime\\) |
| arcsec | `^{\prime\prime}` | \\(^{\\prime\\prime}\\) |
| circle plus | `\oplus` | \\(\\oplus\\) |
| circle times | `\otimes` | \\(\\otimes\\) |
| equal | \= | \\(=\\) |
| not equal | `\ne` | \\(\\ne\\) |
| less than | `<` | \\(<\\) |
| less than or equal to | `\le` | \\(\\le\\) |
| greater than or equal to | `\ge` | \\(\\ge\\) |
| approximately equal to | `\approx` | \\(\\approx\\) |

## Functions


| 描述 | 命令 | 输出 |
| --- | --- | --- |
| maps to | `\to` | \\(\\to\\) |
| composition | `\circ` | \\(\\circ\\) |

## 希腊字母


| 命令 | 输出 | 命令 | 输出 |
| --- | --- | --- | --- |
| `\alpha` | \\(\\alpha\\) | `\tau` | \\(\\tau\\) |
| `\beta` | \\(\\beta\\) | `\theta` | \\(\\theta\\) |
| `\chi` | \\(\\chi\\) | `\upsilon` | \\(\\upsilon\\) |
| `\delta` | \\(\\delta\\) | `\xi` | \\(\\xi\\) |
| `\epsilon` | \\(\\epsilon\\) | `\zeta` | \\(\\zeta\\) |
| `\varepsilon` | \\(\\varepsilon\\) | `\Delta` | \\(\\Delta\\) |
| `\eta` | \\(\\eta\\) | `\Gamma` | \\(\\Gamma\\) |
| `\gamma` | \\(\\gamma\\) | `Lambda` | \\(\\Lambda\\) |
| `\iota` | \\(\\iota\\) | `\Omega` | \\(\\Omega\\) |
| `\kappa` | \\(\\kappa\\) | `\Phi` | \\(\\Phi\\) |
| `lambda` | \\(\\lambda\\) | `\Pi` | \\(\\Pi\\) |
| `\mu` | \\(\\mu\\) | `\Psi` | \\(\\Psi\\) |
| `\nu` | \\(\\nu\\) | `Sigma` | \\(\\Sigma\\) |
| `\omega` | \\(\\omega\\) | `\Theta` | \\(Theta\\) |
| `\phi` | \\(\\phi\\) | `\Upsilon` | \\(\\Upsilon\\) |
| `\varphi` | \\(\\varphi\\) | `\Xi` | \\(\\Xi\\) |
| `\pi` | \\(\\pi\\) | `\aleph` | \\(\\aleph\\) |
| `\psi` | \\(\\psi\\) | `\beth` | \\(\\beth\\) |
| `\rho` | \\(\\rho\\) | `\daleth` | \\(\\daleth\\) |
| `\sigma` | \\(\\sigma\\) | `\gimel` | \\(\\gimel\\) |

## 向量


| 描述 | 命令 | 输出 |
| --- | --- | --- |
| vector | `\vec{v}` | \\(\\vec{v}\\) |
| vector | `\mathbf{v}` | \\(\\mathbf{v}\\) |

## 集合


| 描述 | 命令 | 输出 |
| --- | --- | --- |
| set brackets | `\{1,2,3\}` | \\(\\{1,2,3\\}\\) |
| element of | `\in` | \\(\\in\\) |
| subset of | `\subset` | \\(\\subset\\) |
| subset of | `\subseteq` | \\(\\subseteq\\) |
| contains | `\supset` | \\(\\supset\\) |
| contains | `\supseteq` | \\(\\supseteq\\) |
| union | `\cup` | \\(\\cup\\) |
| intersection | `\cap` | \\(\\cap\\) |
| big union | `\bigcup_{n=1}^{10}A_n` | \\(\\bigcup\_{n=1}^{10}A\_n\\) |
|   | `\bigcap_{n=1}^{10}A_n` | \\(\\bigcap\_{n=1}^{10}A\_n\\) |
|   | `\emptyset` | \\(\\emptyset\\) |
|   | `\mathcal{P}` | \\(\\mathcal{P}\\) |
|   | `\min` | \\(\\min\\) |
|   | `\max` | \\(\\max\\) |
|   | `\sup` | \\(\\sup\\) |
|   | `\inf` | \\(\\inf\\) |
|   | `\limsup` | \\(\\limsup\\) |
|   | `\liminf` | \\(\\liminf\\) |
|   | `\overline{A}` | \\(\\overline{A}\\) |
| Set of real numbers | `\mathbb{R}` | \\(\\mathbb{R}\\) |
|   |   |   |

## 逻辑


| 描述 | 命令 | 输出 |
| --- | --- | --- |
| not | `\sim` | \\(\\sim\\) |
| and | `\land` | \\(\\land\\) |
| or | `\lor` | \\(\\lor\\) |
| if..then | `\to` | \\(\\to\\) |
| if and only if | `\leftrightarrow` | \\(\\leftrightarrow\\) |
| logical eq | `\equiv` | \\(\\equiv\\) |
| therefore | ∴ | \\(\\therefore\\) |
| there exists | `\exists` | \\(\\exists\\) |
| for all | `\forall` | \\(\\forall\\) |
| implies | `\Rightarrow` | \\(\\Rightarrow\\) |
| equivalent | `\Leftrightarrow` | \\(\\Leftrightarrow\\) |

## 微积分


| 描述 | 命令 | 输出 |
| --- | --- | --- |
| derivative | `\frac{df}{dx}` | \\(\\frac{df}{dx}\\) |
| derivative | `f'` | \\(f'\\) |
| partial derivative | `\frac{\partial f} {\partial x}` | \\(\\frac{\\partial f} {\\partial x}\\) |
| limits | `\lim_{x\to \infty}` | \\(\\lim\_{x\\to \\infty}\\) |
| sum | `\sum_{n=1}^{\infty}a_n` | \\(\\sum\_{n=1}^{\\infty}a\_n\\) |
| product | `\prod_{n=1}^{\infty}a_n` | \\(\\prod\_{n=1}^{\\infty}a\_n\\) |
| integral | `\int` | \\(\\int\\) |
|   | `\iint` | \\(\\iint\\) |
|   | `\iiint` | \\(\\iiint\\) |

## 三角函数


| 描述 | 命令 | 输出 |
| --- | --- | --- |
|   | `\angle ABC` | \\(\\angle ABC\\) |
|   | `90^{\circ}` | \\(90^{\\circ}\\) |
|   | `\triangle ABC` | \\(\\triangle ABC\\) |
|   | `\overline{AB}` | \\(\\overline{AB}\\) |
|   | `\sin` | \\(\\sin\\) |
|   | `\cos` | \\(\\cos\\) |
|   | `\tan` | \\(\\tan\\) |
|   | `\cot` | \\(\\cot\\) |
|   | `\sec` | \\(\\sec\\) |
|   | `\csc` | \\(\\csc\\) |
|   | `\arcsin` | \\(\\arcsin\\) |
|   | `\arccos` | \\(\\arccos\\) |
|   | `\arctan` | \\(\\arctan\\) |

## 其他


| 描述 | 命令 | 输出 |
| --- | --- | --- |
| underbrace | `\underbrace{}_{}` | \\(\\underbrace{}\_i\\) |
| boxed | `\boxed` | \\(\\boxed{\\frac {a} {b}}\\) |
| hat | `\hat{}` | \\(\\hat{\\theta}\\) |
|   | `\widehat{d e f}` | \\(\\widehat{d e f}\\) |
| overbrace | `\overbrace{}^{}` | \\(\\overbrace{ 1+2+\\cdots+100 }^{5050}\\) |
|   | `\binom{n}{k}` | \\(\\binom{n}{k}\\) |
|   | `op\stackrel{a}{\longrightarrow}op` | \\(op\\stackrel{a}{\\longrightarrow}op\\) |

\\binom{n}{k} \\end{equation}

### cases

写法：

\\begin{equation}
F= \\begin{cases} a & {b=0}\\\\ c & {d=1} \\end{cases}
\\end{equation}

效果：

\\begin{equation} F= \\begin{cases} a & {b=0}\\\\ c & {d=1} \\end{cases} \\end{equation}

或者这种写法：

f(n) =
\\begin{cases}
n/2,  & \\mbox{if }n\\mbox{ is even} \\\\
3n+1, & \\mbox{if }n\\mbox{ is odd}
\\end{cases}

### 公式换行、对齐

写法：

\\begin{align}
F &= a + b \\\\&=c+d \\\\&=e+f
\\end{align}

效果：

\\begin{align} F &= a + b \\\\&=c+d \\\\&=e+f \\end{align}

关键是 align, & 用于对齐， \\\\用于换行

### substack

\\begin{equation}
\\sum\_{\\substack{-m \\le j \\le +m \\\\ j \\ne 0}}
\\end{equation}

使限制条件处于并列的两行：

\\begin{equation} \\sum\_{\\substack{-m \\le j \\le +m \\\\ j \\ne 0}} \\end{equation}

### matrix

\\begin{vmatrix}
x & y \\\\
z & v
\\end{vmatrix}

\\begin{equation} \\begin{vmatrix} x & y \\\\ z & v \\end{vmatrix} \\end{equation}

\\begin{Vmatrix}
x & y \\\\
z & v
\\end{Vmatrix}

\\begin{equation} \\begin{Vmatrix} x & y \\\\ z & v \\end{Vmatrix} \\end{equation}

\\begin{pmatrix}
x & y \\\\
z & v
\\end{pmatrix}

\\begin{equation} \\begin{pmatrix} x & y \\\\ z & v \\end{pmatrix} \\end{equation}

## 最后

如果是写一些笔记或者论文中有大量数学符号，我推荐使用 Org mode 来写， 真的非常非常方便，如果你体验过一次就会知道。对很多人来说，这个其实门槛有点高了，因为你必须要对 Emacs 有所熟悉才行。 Org mode 下原生支持的符号可参考：[Symbols in Org-mode](https://orgmode.org/worg/org-symbols.html) 。

## Ref:

*   [https://www.authorea.com/users/77723/articles/110898-how-to-write-mathematical-equations-expressions-and-symbols-with-latex-a-cheatsheet](https://www.authorea.com/users/77723/articles/110898-how-to-write-mathematical-equations-expressions-and-symbols-with-latex-a-cheatsheet)
*   [https://chem.libretexts.org/Courses/Remixer\_University/Construction\_Guide/3:\_Advanced\_Editing/3.3B:\_LaTeX//MathJax\_Examples](https://chem.libretexts.org/Courses/Remixer_University/Construction_Guide/3:_Advanced_Editing/3.3B:_LaTeX//MathJax_Examples)
