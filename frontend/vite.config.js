import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

const PUBLIC_PATHS = ['/', '/donors', '/requests', '/doctors', '/gallery', '/about']
const DESCRIPTION =
  'BloodConnector is a free network for patients, blood donors, and volunteer doctors. Search matching donors, post a blood request, and get medical advice.'

function seoPlugin(siteUrl) {
  return {
    name: 'bloodconnector-seo',
    transformIndexHtml(html) {
      const canonical = siteUrl ? `\n    <link rel="canonical" href="${siteUrl}/" />` : ''
      const ogUrl = siteUrl ? `\n    <meta property="og:url" content="${siteUrl}/" />` : ''
      const payload = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'BloodConnector',
        description: DESCRIPTION,
      }
      if (siteUrl) {
        payload.url = siteUrl
        payload.potentialAction = {
          '@type': 'SearchAction',
          target: `${siteUrl}/donors?area={search_term_string}`,
          'query-input': 'required name=search_term_string',
        }
      }
      return html
        .replace('<!--seo-canonical-->', `${canonical}${ogUrl}`)
        .replace(
          '<!--seo-jsonld-->',
          `<script type="application/ld+json">${JSON.stringify(payload)}</script>`,
        )
    },
    closeBundle() {
      const dist = path.resolve(process.cwd(), 'dist')
      if (!fs.existsSync(dist)) return
      const robots = [
        'User-agent: *',
        'Allow: /',
        'Disallow: /dashboard',
        'Disallow: /login',
        'Disallow: /signup',
        'Disallow: /profile',
        '',
        ...(siteUrl ? [`Sitemap: ${siteUrl}/sitemap.xml`] : []),
      ]
      fs.writeFileSync(path.join(dist, 'robots.txt'), `${robots.join('\n').trim()}\n`)
      if (!siteUrl) return
      const urls = PUBLIC_PATHS.map((route) => {
        const loc = `${siteUrl}${route}`
        const priority = route === '/' ? '1.0' : '0.8'
        return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${priority}</priority>\n  </url>`
      }).join('\n')
      fs.writeFileSync(
        path.join(dist, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || '').replace(/\/$/, '')

  return {
    plugins: [react(), tailwindcss(), seoPlugin(siteUrl)],
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:4000',
          changeOrigin: true,
        },
      },
    },
    preview: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:4000',
          changeOrigin: true,
        },
      },
    },
  }
})
