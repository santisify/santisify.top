<?xml version="1.0" encoding="utf-8"?>
<!--
  Minimal RSS reader view.
  Purpose: show a readable list of articles (date / title / description / tags)
  instead of raw XML. Deliberately plain — no cards, no dark mode, no gradients.
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:atom="http://www.w3.org/2005/Atom"
                xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><xsl:value-of select="/rss/channel/title"/> · RSS</title>
        <style>
          body {
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
            max-width: 42rem;
            margin: 0 auto;
            padding: 2rem 1rem;
            color: #1a1a1a;
            background: #fff;
          }
          a { color: #2563eb; }
          h1 { font-size: 1.5rem; margin: 0 0 .25rem; }
          .info { color: #666; font-size: .875rem; margin-bottom: 2rem; }
          .info a { margin-right: .75rem; }
          .item { padding: .9rem 0; border-bottom: 1px solid #e5e5e5; }
          .item:last-child { border-bottom: 0; }
          .item-title { font-size: 1rem; font-weight: 600; text-decoration: none; }
          .item-title:hover { text-decoration: underline; }
          .item-date { color: #666; font-size: .8125rem; }
          .item-desc { color: #444; font-size: .875rem; margin: .25rem 0 0; }
          .item-tags { margin: .35rem 0 0; font-size: .75rem; color: #666; }
          .item-tags span {
            border: 1px solid #ddd;
            border-radius: 9999px;
            padding: 0 .5rem;
            margin-right: .3rem;
            display: inline-block;
          }
          @media (prefers-color-scheme: dark) {
            body { background: #16181d; color: #e6e6e6; }
            a { color: #7aa7ff; }
            .info, .item-date, .item-tags { color: #9aa0a6; }
            .item-desc { color: #c4c7cc; }
            .item { border-bottom-color: #2e3238; }
            .item-tags span { border-color: #2e3238; }
          }
        </style>
      </head>
      <body>
        <h1><xsl:value-of select="/rss/channel/title"/></h1>
        <p class="info">
          <xsl:value-of select="/rss/channel/description"/>
          <br/>
          <a>
            <xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute>
            <xsl:value-of select="/rss/channel/link"/>
          </a>
        </p>

        <!-- One row per article: date, title, description, tags. No article body. -->
        <xsl:for-each select="/rss/channel/item">
          <div class="item">
            <div class="item-date">
              <xsl:value-of select="pubDate"/>
            </div>
            <a class="item-title">
              <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
              <xsl:value-of select="title"/>
            </a>
            <xsl:if test="description">
              <p class="item-desc"><xsl:value-of select="description"/></p>
            </xsl:if>
            <xsl:if test="category">
              <p class="item-tags">
                <xsl:for-each select="category">
                  <span><xsl:value-of select="."/></span>
                </xsl:for-each>
              </p>
            </xsl:if>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
