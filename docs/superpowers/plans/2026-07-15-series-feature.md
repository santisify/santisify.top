# Series Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `series` field to blog frontmatter and create dedicated series listing/detail pages with cross-reference in individual blog posts.

**Architecture:** Extend existing blog content schema, add utility functions for grouping and slug generation, create two new page routes (`/series` and `/series/[slug]`), and add a conditional "this series" section in the BlogPost layout.

**Tech Stack:** Astro 5, astro-pure theme, UnoCSS, `pinyin` package for Chinese slug generation

## Global Constraints

- Use `bun` for all package management (lockfile is `bun.lock`)
- Style follows UnoCSS utility classes consistent with existing tag/archive pages
- Import ordering: Astro imports first, then `@/` aliases, then relative (enforced by Prettier)
- Single quotes, no semicolons, 2-space indent, print width 100
- No test framework — verify by running `bun dev` and checking pages manually
- Run `bun yijiansilian` (lint → sync → check → format) after completing all tasks

---

### Task 1: Install pinyin dependency

**Files:**
- Modify: `package.json` (add devDependency)
- Generate: `bun.lock`

**Interfaces:**
- Consumes: none
- Produces: `pinyin` package available for import

- [ ] **Step 1: Install pinyin package**

Run: `bun add -d pinyin`

- [ ] **Step 2: Verify installation**

Run: `ls node_modules/pinyin/package.json` — should exist

- [ ] **Step 3: Commit**

```bash
git add package.json bun.lock
git commit -m "chore: add pinyin dependency for series slug generation"
```

---

### Task 2: Add series fields to blog schema

**Files:**
- Modify: `src/content.config.ts:34-39` (add two fields to the z.object schema)

**Interfaces:**
- Consumes: existing blog schema from `src/content.config.ts`
- Produces: `series: string | undefined`, `seriesOrder: number | undefined` available on all blog posts

- [ ] **Step 1: Add series and seriesOrder to schema**

Edit `src/content.config.ts`, inside the `z.object({...})` schema (after the `comment` field around line 39), add:

```ts
series: z.string().optional(),
seriesOrder: z.number().optional(),
```

The schema block should now end with:

```ts
export const collections = { blog }
```

Where the blog collection schema's z.object contains all original fields plus the two new ones.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun check`

Expected: no errors related to content config.

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: add series and seriesOrder fields to blog schema"
```

---

### Task 3: Create series utility functions

**Files:**
- Create: `src/utils/series.ts`

**Interfaces:**
- Consumes: `pinyin` package, `CollectionEntry<'blog'>` type
- Produces: `generateSlug(seriesName: string): string`, `getSeriesGroupMap(posts: CollectionEntry<'blog'>[]): Map<string, CollectionEntry<'blog'>[]>`, `getSeriesPosts(seriesName: string, posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[]`

- [ ] **Step 1: Create src/utils/series.ts**

Write the file `src/utils/series.ts` with the following content:

```ts
import type { CollectionEntry } from 'astro:content'
import pinyin from 'pinyin'

/**
 * Convert a series name to a URL-safe slug.
 * Chinese characters are converted to pinyin with hyphens.
 * Example: "Go学习指南" → "go-xue-xi-zhi-nan"
 */
export function generateSlug(seriesName: string): string {
  // First check if the name is already ASCII-only
  if (/^[\x00-\x7F]+$/.test(seriesName)) {
    return seriesName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  // Convert Chinese (and other non-ASCII) characters to pinyin
  const chars = seriesName.split('')
  const pinyinParts = chars.map((char) => {
    // Skip whitespace and punctuation
    if (/[\s\-_]/.test(char)) return '-'
    if (/^[\x00-\x7F]$/.test(char)) return char.toLowerCase()
    const result = pinyin(char, { style: pinyin.STYLE_NORMAL })
    // result is like [['hao'], ['xi']] — take first reading
    return result[0]?.[0] ?? ''
  })

  return pinyinParts.join('-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

/**
 * Group blog posts by their series name.
 * Only includes posts that have a non-empty series field.
 */
export function getSeriesGroupMap(
  posts: CollectionEntry<'blog'>[]
): Map<string, CollectionEntry<'blog'>[]> {
  const map = new Map<string, CollectionEntry<'blog'>[]>()

  posts.forEach((post) => {
    const series = post.data.series
    if (!series) return

    if (!map.has(series)) {
      map.set(series, [])
    }
    map.get(series)!.push(post)
  })

  return map
}

/**
 * Get all posts belonging to a series, sorted by seriesOrder ascending.
 * Posts without seriesOrder are placed at the end, sorted by publishDate.
 */
export function getSeriesPosts(
  seriesName: string,
  posts: CollectionEntry<'blog'>[]
): CollectionEntry<'blog'>[] {
  const seriesPosts = posts.filter((p) => p.data.series === seriesName)

  return seriesPosts.sort((a, b) => {
    const aOrder = a.data.seriesOrder ?? Infinity
    const bOrder = b.data.seriesOrder ?? Infinity

    if (aOrder !== Infinity && bOrder !== Infinity) {
      return aOrder - bOrder
    }

    // One or both lack seriesOrder — fall back to publishDate desc
    return b.data.publishDate.getTime() - a.data.publishDate.getTime()
  })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun check`

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/utils/series.ts
git commit -m "feat: add series utility functions (slug, group, sort)"
```

---

### Task 4: Create series listing page (/series)

**Files:**
- Create: `src/pages/series/index.astro`

**Interfaces:**
- Consumes: `getBlogCollection()`, `getSeriesGroupMap()`, `generateSlug()`, `getSeriesPosts()`
- Produces: paginated series list page at `/series`

- [ ] **Step 1: Create series listing page**

Write the file `src/pages/series/index.astro`:

```astro
---
import type { CollectionEntry } from 'astro:content'
import { getBlogCollection, sortMDByDate } from 'astro-pure/server'
import { Button } from 'astro-pure/user'
import PageLayout from '@/layouts/BaseLayout.astro'
import { generateSlug, getSeriesGroupMap } from '@/utils/series'

const allPosts = await getBlogCollection()
const allPostsByDate = sortMDByDate(allPosts)
const seriesMap = getSeriesGroupMap(allPostsByDate)

const meta = {
  description: 'A collection of article series published on this blog',
  title: 'Series'
}
---

<PageLayout {meta}>
  <Button title='Back' href='/blog' variant='back' />

  <main class='mt-6 lg:mt-10'>
    <div id='content-header' class='animate'>
      <h1 class='mb-6 text-3xl font-medium'>Series</h1>
    </div>

    <section id='content' class='animate'>
      {seriesMap.size > 0 ? (
        <ul class='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from(seriesMap.entries()).map(([seriesName, posts]) => {
            const slug = generateSlug(seriesName)
            const lastUpdated = posts[0]?.data.updatedDate ?? posts[0]?.data.publishDate
            const lastUpdatedStr = lastUpdated?.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })

            return (
              <li>
                <Button
                  href={`/series/${slug}`}
                  variant='pill'
                  class='flex w-full items-center justify-between rounded-xl px-4 py-3 text-left'
                >
                  <span class='truncate text-lg font-medium'>{seriesName}</span>
                  <span class='ml-3 shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary'>{posts.length}</span>
                </Button>
              </li>
            )
          })}
        </ul>
      ) : (
        <p>No series yet.</p>
      )}
    </section>
  </main>
</PageLayout>
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun check`

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/series/index.astro
git commit -m "feat: add series listing page at /series"
```

---

### Task 5: Create series detail page (/series/[slug])

**Files:**
- Create: `src/pages/series/[slug].astro`

**Interfaces:**
- Consumes: `generateSlug()`, `getSeriesPosts()`, `getBlogCollection()`, `sortMDByDate()`
- Produces: series detail page at `/series/{slug}` with ordered post list

- [ ] **Step 1: Create series detail page**

Write the file `src/pages/series/[slug].astro`:

```astro
---
import type { GetStaticPaths } from 'astro'
import type { CollectionEntry } from 'astro:content'
import { PostPreview } from 'astro-pure/components/pages'
import { getBlogCollection, sortMDByDate } from 'astro-pure/server'
import { Button } from 'astro-pure/user'
import PageLayout from '@/layouts/BaseLayout.astro'
import { generateSlug, getSeriesGroupMap, getSeriesPosts } from '@/utils/series'

export const prerender = true

export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await getBlogCollection()
  const allPostsByDate = sortMDByDate(allPosts)
  const seriesMap = getSeriesGroupMap(allPostsByDate)

  return Array.from(seriesMap.entries()).map(([seriesName]) => {
    const slug = generateSlug(seriesName)
    return {
      params: { slug },
      props: { seriesName }
    }
  })
}

interface Props {
  seriesName: string
}

const { seriesName } = Astro.props
const { slug } = Astro.params

const allPosts = await getBlogCollection()
const allPostsByDate = sortMDByDate(allPosts)
const seriesPosts = getSeriesPosts(seriesName, allPostsByDate)

const meta = {
  description: `Articles in the ${seriesName} series`,
  title: seriesName
}
---

<PageLayout {meta}>
  <Button title='Back' href='/series' variant='back' />

  <main class='mt-6 lg:mt-10'>
    <div id='content-header' class='animate'>
      <h1 class='mb-2 text-3xl font-medium'>{seriesName}</h1>
      <p class='text-muted-foreground'>{seriesPosts.length} article{seriesPosts.length !== 1 && 's'}</p>
    </div>

    <section id='content' class='animate'>
      <ul class='flex flex-col gap-y-3 text-start'>
        {seriesPosts.map((post, index) => {
          const order = post.data.seriesOrder ?? index + 1
          return (
            <li>
              <PostPreview post={post} detailed class='border-l-4 border-primary pl-4' />
            </li>
          )
        })}
      </ul>
    </section>
  </main>
</PageLayout>
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun check`

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/series/\[slug\].astro
git commit -m "feat: add series detail page at /series/[slug]"
```

---

### Task 6: Add Series to header navigation

**Files:**
- Modify: `src/site.config.ts:50-57` (header.menu array)

**Interfaces:**
- Consumes: existing `theme.header.menu` array
- Produces: "Series" link visible in site header after "Blog"

- [ ] **Step 1: Add Series menu item**

Edit `src/site.config.ts`, in the `theme.header.menu` array, add a new entry after the "Blog" item:

```ts
menu: [
  { title: 'Blog', link: '/blog' },
  { title: 'Series', link: '/series' },  // <-- ADD THIS LINE
  { title: 'Projects', link: '/projects' },
  { title: 'Links', link: '/links' },
  { title: 'About', link: '/about' },
  { title: '🚇', link: 'https://www.travellings.cn/go.html' }
]
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `bun check`

- [ ] **Step 3: Commit**

```bash
git add src/site.config.ts
git commit -m "feat: add Series link to header navigation"
```

---

### Task 7: Add "This Series" section to BlogPost layout

**Files:**
- Modify: `src/layouts/BlogPost.astro`

**Interfaces:**
- Consumes: `post.data.series`, `getSeriesPosts()`, `generateSlug()`
- Produces: conditional "本系列" section rendered below ArticleBottom when post belongs to a series

- [ ] **Step 1: Add series section to BlogPost layout**

Edit `src/layouts/BlogPost.astro` to add the series section.

First, add the import at the top of the script block (after line 8):

```ts
import { getSeriesPosts, generateSlug } from '@/utils/series'
```

Then, inside the `<Fragment slot='bottom'>` section, add the series component after `<ArticleBottom>` (around line 63) and before `<Comment>`:

```astro
<Fragment slot='bottom'>
  {/* Copyright */}
  <Copyright {data} />
  {/* Article recommend */}
  <ArticleBottom collections={posts} {id} class='mt-3 sm:mt-6' />
  {/* This Series */}
  {data.series && (() => {
    const seriesPosts = getSeriesPosts(data.series, posts)
    const slug = generateSlug(data.series)
    return (
      <div class='mt-3 sm:mt-6 rounded-lg border border-primary/20 p-4 sm:p-6'>
        <h3 class='mb-3 text-lg font-semibold'>本系列 · {data.series}</h3>
        <ul class='space-y-2'>
          {seriesPosts.map((sp, i) => {
            const order = sp.data.seriesOrder ?? i + 1
            const isCurrent = sp.id === id
            return (
              <li class={isCurrent ? 'text-primary' : ''}>
                <a
                  href={`/series/${slug}`}
                  class='flex items-start gap-2 text-sm hover:underline'
                >
                  <span class='shrink-0 font-mono text-muted-foreground'>{String(order).padStart(2, '0')}</span>
                  <span class={isCurrent ? 'font-medium' : ''}>{sp.data.title}{isCurrent && ' (当前)'}</span>
                </a>
              </li>
            )
          })}
        </ul>
        <a href={`/series/${slug}`} class='mt-3 text-sm text-muted-foreground hover:text-primary'>查看全部 →</a>
      </div>
    )
  })()}
  {/* Comment */}
  {!isDraft && enableComment && <Comment class='mt-3 sm:mt-6' />}
</Fragment>
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun check`

Expected: no errors. May need to adjust types if Astro's expression syntax causes issues — if so, extract the series section into a separate component.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BlogPost.astro
git commit -m "feat: add 'this series' section to blog post layout"
```

---

### Task 8: Final verification and cleanup

**Files:**
- All modified/created files above

**Interfaces:**
- Consumes: everything above
- Produces: verified, formatted, linted codebase ready for review

- [ ] **Step 1: Run full pre-commit pipeline**

Run: `bun yijiansilian`

Expected: all lint, typecheck, and format pass cleanly.

- [ ] **Step 2: Start dev server and verify manually**

Run: `bun dev`

Then check:
1. Navigate to `/series` — should show series listing (may be empty if no posts have series)
2. Add a test blog post with `series: "测试系列"` and `seriesOrder: 1` in frontmatter
3. Navigate to `/series` — should show the test series
4. Click into the series detail page — should show the test post
5. Navigate to the test blog post — should show "本系列" section at bottom
6. Verify header nav shows "Series" link

- [ ] **Step 3: Commit all remaining changes**

```bash
git add -A
git commit -m "feat: add series feature — listing, detail, and cross-reference"
```

---

## Summary of Files Changed

| File | Action |
|------|--------|
| `package.json` | Modified — add `pinyin` devDependency |
| `bun.lock` | Generated — by `bun add` |
| `src/content.config.ts` | Modified — add `series`, `seriesOrder` fields |
| `src/utils/series.ts` | Created — utility functions |
| `src/pages/series/index.astro` | Created — series listing page |
| `src/pages/series/[slug].astro` | Created — series detail page |
| `src/site.config.ts` | Modified — add "Series" to header menu |
| `src/layouts/BlogPost.astro` | Modified — add conditional series section |
