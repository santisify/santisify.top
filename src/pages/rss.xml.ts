import type { AstroGlobal, ImageMetadata } from 'astro'
import { getImage } from 'astro:assets'
import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'
import rss from '@astrojs/rss'
import type { Root } from 'mdast'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import config from 'virtual:config'

import { getBlogCollection, sortMDByDate } from 'astro-pure/server'

// Get dynamic import of images as a map collection
const imagesGlob = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/**/*.{jpeg,jpg,png,gif,avif,webp}' // add more image formats if needed
)

/** A blog post or a series post, reduced to what the feed actually needs. */
type FeedPost = {
  id: string
  /** Absolute-ish path on the site, e.g. `/blog/hello` or `/series/go/02-env-setup` */
  link: string
  data: {
    title: string
    description: string
    publishDate: Date
    heroImage?: { src: string | ImageMetadata }
    tags?: string[]
  }
  body: string
  /** Directory prefix used to resolve relative image paths inside the body */
  assetBase: string
}

/** Drop inline styles and `<style>` blocks so readers render plain, clean markup. */
function remarkStripStyles() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'style' || node.tagName === 'script') {
        node.children = []
        node.properties = {}
        return
      }
      delete node.properties?.style
    })
  }
}

const renderContent = async (post: FeedPost, site: URL) => {
  // Replace image links with the correct path
  function remarkReplaceImageLink() {
    /**
     * @param {Root} tree
     */
    return async (tree: Root) => {
      const promises: Promise<void>[] = []
      visit(tree, 'image', (node) => {
        if (node.url.startsWith('/images')) {
          node.url = `${site}${node.url.replace('/', '')}`
        } else if (/^https?:\/\//.test(node.url)) {
          // Remote image, leave it alone
        } else {
          const imagePathPrefix = `${post.assetBase}/${node.url.replace('./', '')}`
          const promise = imagesGlob[imagePathPrefix]?.().then(async (res) => {
            const imagePath = res?.default
            if (imagePath) {
              node.url = `${site}${(await getImage({ src: imagePath })).src.replace('/', '')}`
            }
          })
          if (promise) promises.push(promise)
        }
      })
      await Promise.all(promises)
    }
  }

  const file = await unified()
    .use(remarkParse)
    .use(remarkReplaceImageLink)
    .use(remarkRehype, { allowDangerousHtml: true })
    // Some posts are written as raw HTML; without this their body would be dropped.
    .use(rehypeRaw)
    .use(remarkStripStyles)
    .use(rehypeStringify)
    .process(post.body)

  return String(file)
}

/** Series live at `/series/<series>/<filename-without-extension>`. */
const seriesLink = (post: CollectionEntry<'series'>) => {
  const stem = post.id.split('/').pop()?.replace(/\.[^.]+$/, '') || post.id
  return `/series/${post.data.series || 'other'}/${stem}`
}

const heroImageSrc = (src?: string | ImageMetadata) =>
  typeof src === 'string' ? src : (src?.src ?? '')

const GET = async (context: AstroGlobal) => {
  const siteUrl = context.site ?? new URL(import.meta.env.SITE)

  const blogPosts = (await getBlogCollection()) as CollectionEntry<'blog'>[]
  // `series` has no `draft` field, so read the collection directly.
  const seriesPosts = await getCollection('series')

  const feedPosts: FeedPost[] = [
    ...blogPosts.map((post) => ({
      id: post.id,
      link: `/blog/${post.id}`,
      data: post.data,
      body: post.body ?? '',
      assetBase: `/src/content/blog/${post.id}`
    })),
    ...seriesPosts.map((post) => ({
      id: post.id,
      link: seriesLink(post),
      data: post.data,
      body: post.body ?? '',
      assetBase: `/src/content/series/${post.id.split('/').slice(0, -1).join('/')}`
    }))
  ]

  const sorted = sortMDByDate(feedPosts as never) as unknown as FeedPost[]

  return rss({
    // Basic configs
    trailingSlash: false,
    // Minimal reader view so browsers show an article list instead of raw XML
    stylesheet: '/scripts/feed.xsl',

    // Contents
    title: config.title,
    description: config.description,
    site: import.meta.env.SITE,
    items: await Promise.all(
      sorted.map(async (post) => {
        const hero = heroImageSrc(post.data.heroImage?.src)
        return {
          title: post.data.title,
          description: post.data.description,
          pubDate: post.data.publishDate,
          link: post.link,
          categories: post.data.tags ?? [],
          customData: hero ? `<enclosure url="${hero}" />` : undefined,
          content: await renderContent(post, siteUrl)
        }
      })
    )
  })
}

export { GET }
