# Series Feature Design Spec

**Date:** 2026-07-15
**Status:** Approved

## Goal
Add a `series` field to blog frontmatter and create dedicated series listing/detail pages, plus cross-reference in individual blog posts.

## Decisions Made
- **Data model:** `series: string | undefined`, `seriesOrder: number | undefined` — optional, independent fields
- **Approach:** Minimal changes, reuse existing patterns from tag/archive pages
- **Navigation:** Add "Series" menu item in header (position: after Blog)

## Scope

### In Scope
1. Extend blog schema with `series` and `seriesOrder` fields
2. `/series` — series listing page (grouped by series name, shows count + last updated)
3. `/series/[slug]` — single series detail page (posts ordered by seriesOrder)
4. Header nav — add "Series" link
5. BlogPost layout — "This series" section at bottom of posts that belong to a series
6. Utility functions for slug generation and series grouping

### Out of Scope
- Changes to `/blog` listing page
- Changes to `/tags` or `/archives`
- RSS feed modifications
- Search index modifications
- Series-specific metadata for SEO

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/content.config.ts` | Modify | Add `series`, `seriesOrder` to blog schema |
| `src/utils/series.ts` | Create | `generateSlug()`, `groupBySeries()`, `getSeriesPosts()` |
| `src/pages/series/index.astro` | Create | Series listing page |
| `src/pages/series/[slug].astro` | Create | Series detail page |
| `src/site.config.ts` | Modify | Add "Series" to header.menu |
| `src/layouts/BlogPost.astro` | Modify | Add "本系列" section conditionally |

## Design Details

### Slug Generation
Chinese series names are converted to URL-safe slugs using pinyin. Example: "Go学习指南" → "go-xue-xi-zhi-nan". Uses `pinyin` npm package.

### Series Listing Page (`/series`)
- Groups all posts with a `series` field
- Each series card shows: series name, post count, last updated date
- Styled consistently with existing tag/archive pages (UnoCSS utility classes)
- Clicking a card navigates to `/series/{slug}`

### Series Detail Page (`/series/[slug]`)
- `getStaticPaths()` generates one route per unique series name
- Displays series title, then posts sorted by `seriesOrder` ascending
- Each post entry: title, publish date, short description, link to `/blog/{id}`
- Shows position indicator: "第 3 / 15 篇"

### BlogPost Layout Addition
- Conditional: only renders if `post.data.series` exists
- Shows "本系列" heading with series name
- Lists all posts in the series in order, marking the current one
- Uses existing `PostPreview` or simple link list pattern

### Dependencies
- Add `pinyin` package for Chinese-to-pinyin conversion
