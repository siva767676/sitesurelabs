import { prerender } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'
import App from './App'

export { allPages } from '@/data/seo'
export { site } from '@/data/site'
export { products } from '@/data/products'
export { articles } from '@/data/articles'

/**
 * Build-time render of one route to HTML. `prerender` (React 19) waits for every Suspense boundary, so the lazy
 * route chunks are resolved and the real page content is in the output, not a loading fallback.
 * The client then hydrates this markup (src/main.tsx). The same markup goes to every visitor and crawler.
 */
export async function render(url: string): Promise<string> {
  const { prelude } = await prerender(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  )
  return new Response(prelude).text()
}
