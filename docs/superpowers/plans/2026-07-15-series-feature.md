# Series Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a dedicated "series" content collection for organizing learning materials into structured series, with listing and detail pages accessible from the site header.

**Architecture:** Define a new `series` content collection in `content.config.ts`, create `/series` listing page and `/series/[slug]` detail pages, add navigation link. Series articles are stored in `src/content/series/{slug}/` with frontmatter including `series` field. Each series folder represents one series.

**Tech Stack:** Astro 5, astro-pure theme, UnoCSS

## Global Constraints

- Use `bun` for all package management (lockfile is `bun.lock`)
- Style follows UnoCSS utility classes consistent with existing tag/archive pages
- Import ordering: Astro imports first, then `@/` aliases, then relative (enforced by Prettier)
- Single quotes, no semicolons, 2-space indent, print width 100
- No test framework — verify by running `bun dev` and checking pages manually
- Run `bun yijiansilian` (lint → sync → check → format) after completing all tasks
- Series articles are INDEPENDENT from blog — they do NOT appear in `/blog` listing

---

### Task 1: Add series content collection to content.config.ts

**Files:**
- Modify: `src/content.config.ts`

**Interfaces:**
- Consumes: existing `blog` collection definition
- Produces: `series` content collection with its own schema, loaded from `src/content/series/`

- [ ] **Step 1: Add series collection definition**

Edit `src/content.config.ts` to add a new `series` collection alongside the existing `blog` collection.

After the existing `blog` collection definition (after line 41, before `export const collections`), add:

```ts
// Define series collection
const series = defineCollection({
  loader: glob({ base: './src/content/series', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(60),
      description: z.string().max(160),
      publishDate: z.coerce.date(),
      heroImage: z
        .object({
          src: image(),
          alt: z.string().optional()
        })
        .optional(),
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      language: z.string().optional(),
      series: z.string(),
      comment: z.boolean().default(false)
    })
})
```

Then update the export line from:
```ts
export const collections = { blog }
```
to:
```ts
export const collections = { blog, series }
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun check`

Expected: no new errors (existing errors in unrelated files are OK).

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: add series content collection"
```

---

### Task 2: Create series listing page (/series)

**Files:**
- Create: `src/pages/series/index.astro`

**Interfaces:**
- Consumes: `getCollection('series')` from astro:content, `sortMDByDate()` from astro-pure/server
- Produces: series listing page at `/series` showing each series folder as a card with name and article count

- [ ] **Step 1: Create series listing page**

Write the file `src/pages/series/index.astro`:

```ts
---
import { getCollection } from 'astro:content'
import { sortMDByDate } from 'astro-pure/server'
import { Button } from 'astro-pure/user'
import PageLayout from '@/layouts/BaseLayout.astro'

const allSeriesPosts = await getCollection('series')
const allSeriesByDate = sortMDByDate(allSeriesPosts)

// Group by series folder (first directory in the path)
const seriesGroups = new Map<string, typeof allSeriesPosts>()
allSeriesByDate.forEach((post) => {
  const parts = post.id.split('/')
  const seriesSlug = parts[1] // e.g., "go" from "series/go/02-env-setup"
  if (!seriesGroups.has(seriesSlug)) {
    seriesGroups.set(seriesSlug, [])
  }
  seriesGroups.get(seriesSlug)!.push(post)
})

const meta = {
  description: 'Structured learning materials organized in series',
  title: 'Series'
}
---

<PageLayout {meta}>
  <Button title='Back' href='/' variant='back' />

  <main class='mt-6 lg:mt-10'>
    <div id='content-header' class='animate'>
      <h1 class='mb-6 text-3xl font-medium'>Series</h1>
    </div>

    <section id='content' class='animate'>
      {seriesGroups.size > 0 ? (
        <ul class='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from(seriesGroups.entries()).map(([seriesSlug, posts]) => (
            <li>
              <Button
                href={`/series/${seriesSlug}`}
                variant='pill'
                class='flex w-full items-center justify-between rounded-xl px-4 py-3 text-left'
              >
                <span class='truncate text-lg font-medium capitalize'>{seriesSlug}</span>
                <span class='ml-3 shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary'>{posts.length}</span>
              </Button>
            </li>
          ))}
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

### Task 3: Create series detail page (/series/[slug])

**Files:**
- Create: `src/pages/series/[slug].astro`

**Interfaces:**
- Consumes: `getCollection('series')`, `sortMDByDate()`
- Produces: series detail page at `/series/{slug}` showing all articles in that series, sorted by filename prefix

- [ ] **Step 1: Create series detail page**

Write the file `src/pages/series/[slug].astro`:

```ts
---
import type { GetStaticPaths } from 'astro'
import { getCollection, render } from 'astro:content'
import { Button } from 'astro-pure/user'
import PageLayout from '@/layouts/BaseLayout.astro'

export const prerender = true

export const getStaticPaths: GetStaticPaths = async () => {
  const allSeriesPosts = await getCollection('series')

  // Extract unique series slugs
  const seriesSlugs = new Set<string>()
  allSeriesPosts.forEach((post) => {
    const parts = post.id.split('/')
    seriesSlugs.add(parts[1])
  })

  return Array.from(seriesSlugs).map((slug) => ({
    params: { slug },
    props: { seriesSlug: slug }
  }))
}

interface Props {
  seriesSlug: string
}

const { seriesSlug } = Astro.props
const { slug } = Astro.params

const allSeriesPosts = await getCollection('series')
const seriesPosts = allSeriesPosts
  .filter((post) => {
    const parts = post.id.split('/')
    return parts[1] === seriesSlug
  })
  .sort((a, b) => {
    // Sort by filename prefix (e.g., 02-env-setup before 03-basics)
    const aName = a.file.stem || ''
    const bName = b.file.stem || ''
    return aName.localeCompare(bName)
  })

const meta = {
  description: `Learning series: ${seriesSlug}`,
  title: seriesSlug
}
---

<PageLayout {meta}>
  <Button title='Back' href='/series' variant='back' />

  <main class='mt-6 lg:mt-10'>
    <div id='content-header' class='animate'>
      <h1 class='mb-2 text-3xl font-medium capitalize'>{seriesSlug}</h1>
      <p class='text-muted-foreground'>{seriesPosts.length} article{seriesPosts.length !== 1 && 's'}</p>
    </div>

    <section id='content' class='animate'>
      <ul class='flex flex-col gap-y-3 text-start'>
        {seriesPosts.map((post) => {
          const stem = post.file.stem || ''
          const link = `/series/${seriesSlug}/${stem}`
          return (
            <li>
              <a href={link} class='block rounded-lg border border-transparent p-3 hover:border-primary/20 hover:bg-muted/50'>
                <div class='flex items-center gap-3'>
                  <span class='shrink-0 font-mono text-muted-foreground'>{stem}</span>
                  <span class='text-lg font-medium'>{post.data.title}</span>
                </div>
                <p class='mt-1 text-sm text-muted-foreground'>{post.data.description}</p>
              </a>
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

### Task 4: Create individual series article page

**Files:**
- Create: `src/pages/series/[slug]/[...page].astro`

**Interfaces:**
- Consumes: `getCollection('series')`, `render()` from astro:content
- Produces: individual series article page at `/series/{slug}/{article-slug}`

- [ ] **Step 1: Create series article page**

Write the file `src/pages/series/[slug]/[...page].astro`:

```ts
---
import type { GetStaticPaths } from 'astro'
import { getCollection, render } from 'astro:content'
import { Button } from 'astro-pure/user'
import PageLayout from '@/layouts/BaseLayout.astro'

export const prerender = true

export const getStaticPaths: GetStaticPaths = async () => {
  const allSeriesPosts = await getCollection('series')

  return allSeriesPosts.map((post) => {
    const parts = post.id.split('/')
    const seriesSlug = parts[1]
    const articleSlug = parts[2] || post.slug

    return {
      params: { slug: seriesSlug, page: articleSlug },
      props: { post }
    }
  })
}

interface Props {
  post: Awaited<ReturnType<typeof getCollection<'series'>>>[number]
}

const { post } = Astro.props
const { slug, page } = Astro.params
const { default: Content, headings } = await render(post)

const meta = {
  description: post.data.description,
  title: post.data.title
}
---

<PageLayout {meta}>
  <Button title='Back' href={`/series/${slug}`} variant='back' />

  <main class='mt-6 lg:mt-10'>
    <div id='content-header' class='animate'>
      <h1 class='mb-2 text-3xl font-medium'>{post.data.title}</h1>
      <p class='text-muted-foreground'>
        {new Date(post.data.publishDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
    </div>

    <article id='content' class='animate prose text-base text-muted-foreground'>
      <Content />
    </article>
  </main>
</PageLayout>
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun check`

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/series/\[slug\]/\[...page\].astro
git commit -m "feat: add series article page at /series/[slug]/[page]"
```

---

### Task 5: Add Series to header navigation

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

### Task 6: Final verification and cleanup

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
1. Navigate to `/series` — should show "go" series card with 18 articles
2. Click into "go" series — should show all 18 articles sorted by filename prefix
3. Click on an article (e.g., `02-env-setup`) — should render the full article content
4. Verify header nav shows "Series" link
5. Verify articles don't appear in `/blog` listing

- [ ] **Step 3: Commit all remaining changes**

```bash
git add -A
git commit -m "feat: add series feature — listing, detail, and article pages"
```

---

## Summary of Files Changed

| File | Action |
|------|--------|
| `src/content.config.ts` | Modified — add `series` content collection |
| `src/pages/series/index.astro` | Created — series listing page |
| `src/pages/series/[slug].astro` | Created — series detail page |
| `src/pages/series/[slug]/[...page].astro` | Created — series article page |
| `src/site.config.ts` | Modified — add "Series" to header menu |
