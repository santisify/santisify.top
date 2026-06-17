<?xml version="1.0" encoding="utf-8"?>
<!--
  Based on pretty-feed-v3 by aboutfeeds.com
  Modernized with cards, dark mode, and improved typography.
-->
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:atom="http://www.w3.org/2005/Atom"
                xmlns:content="http://purl.org/rss/1.0/modules/content/"
                xmlns:dc="http://purl.org/dc/elements/1.1/"
                xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="zh-CN" class="rss-feed-pretty">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><xsl:value-of select="/rss/channel/title"/> · Web Feed</title>
        <style>
          /* 现代化重置与变量 */
          * { box-sizing: border-box; margin: 0; padding: 0; }
          :root {
          --bg: #ffffff;
          --text: #1e293b;
          --muted: #64748b;
          --border: #e2e8f0;
          --link: #2563eb;
          --link-hover: #1d4ed8;
          --card-bg: #f8fafc;
          --card-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
          --radius: 12px;
          --max-width: 760px;
          }
          @media (prefers-color-scheme: dark) {
          :root {
          --bg: #0f172a;
          --text: #e2e8f0;
          --muted: #94a3b8;
          --border: #334155;
          --link: #60a5fa;
          --link-hover: #93bbfd;
          --card-bg: #1e293b;
          --card-shadow: 0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3);
          }
          }
          body {
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
          background: var(--bg);
          color: var(--text);
          line-height: 1.6;
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 1.5rem;
          }
          a { color: var(--link); text-decoration: none; }
          a:hover { color: var(--link-hover); text-decoration: underline; }

          /* 顶部订阅提示 */
          .feed-notice {
          background: #fef9c3;
          border-left: 4px solid #eab308;
          color: #854d0e;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          }
          @media (prefers-color-scheme: dark) {
          .feed-notice {
          background: #422006;
          color: #fde047;
          border-left-color: #eab308;
          }
          }
          .feed-notice a { color: inherit; font-weight: 600; }

          /* 头部 */
          header {
          padding: 2rem 0 1.5rem;
          border-bottom: 2px solid var(--border);
          margin-bottom: 2rem;
          }
          header h1 {
          font-size: 1.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          }
          header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 0.25rem;
          }
          header p {
          color: var(--muted);
          margin-top: 0.5rem;
          }
          .head_link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          margin-top: 1rem;
          padding: 0.4rem 1rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--card-bg);
          font-weight: 500;
          }

          /* 文章列表 */
          .item {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.5rem;
          margin-bottom: 1.25rem;
          box-shadow: var(--card-shadow);
          transition: transform 0.15s, box-shadow 0.15s;
          }
          .item:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 8px -4px rgba(0,0,0,0.08);
          }
          .item h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          line-height: 1.4;
          }
          .item h3 a {
          color: var(--text);
          }
          .item h3 a:hover {
          color: var(--link);
          }
          .item .meta {
          font-size: 0.82rem;
          color: var(--muted);
          margin-bottom: 0.75rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1rem;
          }
          .item .content {
          font-size: 0.95rem;
          line-height: 1.7;
          word-break: break-word;
          max-height: 12em;
          overflow-y: auto;
          }
          .item .content img, .item .content video {
          max-width: 100%;
          border-radius: 8px;
          margin: 0.5rem 0;
          }

          footer {
          margin-top: 3rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          text-align: center;
          color: var(--muted);
          font-size: 0.8rem;
          }
        </style>
      </head>
      <body>
        <!-- aboutfeeds 提示保留 -->
        <div class="feed-notice">
          ⚡ 这是一个 <strong>Web Feed</strong>（RSS）。<strong>订阅</strong>：复制地址栏网址到你的阅读器。<br/>
          <small>初次使用？访问 <a href="https://aboutfeeds.com">About Feeds</a> 免费了解。</small>
        </div>

        <header>
          <h1>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" style="width:1.3em;height:1.3em;vertical-align:text-bottom;">
              <defs>
                <linearGradient id="rssg" x1="0.085" y1="0.085" x2="0.915" y2="0.915">
                  <stop offset="0.0" stop-color="#E3702D"/>
                  <stop offset="0.1071" stop-color="#EA7D31"/>
                  <stop offset="0.3503" stop-color="#F69537"/>
                  <stop offset="0.5" stop-color="#FB9E3A"/>
                  <stop offset="0.7016" stop-color="#EA7C31"/>
                  <stop offset="0.8866" stop-color="#DE642B"/>
                  <stop offset="1.0" stop-color="#D95B29"/>
                </linearGradient>
              </defs>
              <rect width="256" height="256" rx="55" ry="55" fill="#CC5D15"/>
              <rect width="246" height="246" rx="50" ry="50" x="5" y="5" fill="#F49C52"/>
              <rect width="236" height="236" rx="47" ry="47" x="10" y="10" fill="url(#rssg)"/>
              <circle cx="68" cy="189" r="24" fill="#FFF"/>
              <path d="M160 213h-34a82 82 0 0 0 -82 -82v-34a116 116 0 0 1 116 116z" fill="#FFF"/>
              <path d="M184 213A140 140 0 0 0 44 73 V 38a175 175 0 0 1 175 175z" fill="#FFF"/>
            </svg>
            Web Feed Preview
          </h1>
          <h2><xsl:value-of select="/rss/channel/title"/></h2>
          <p><xsl:value-of select="/rss/channel/description"/></p>
          <a class="head_link" target="_blank">
            <xsl:attribute name="href">
              <xsl:value-of select="/rss/channel/link"/>
            </xsl:attribute>
            🌐 访问网站 →
          </a>
        </header>

        <h2 style="font-size:1.2rem; margin-bottom:1rem;">📰 最近更新</h2>

        <xsl:for-each select="/rss/channel/item">
          <div class="item">
            <h3>
              <a target="_blank">
                <xsl:attribute name="href">
                  <xsl:value-of select="link"/>
                </xsl:attribute>
                <xsl:value-of select="title"/>
              </a>
            </h3>
            <div class="meta">
              <span>📅 <xsl:value-of select="pubDate"/></span>
              <xsl:if test="author">
                <span>✍️ <xsl:value-of select="author"/></span>
              </xsl:if>
              <xsl:if test="category">
                <span>🏷 <xsl:value-of select="category"/></span>
              </xsl:if>
            </div>
          </div>
        </xsl:for-each>

        <footer>
          由 <a href="https://github.com/cworld1/astro-theme-pure" style="color:var(--link)">Astro Pure</a> 驱动 · 总计 <xsl:value-of select="count(/rss/channel/item)"/> 篇文章
        </footer>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>