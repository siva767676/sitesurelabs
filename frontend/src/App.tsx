import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Boundary, ErrorState, RouteFallback } from '@/components/ui/States'
import Home from '@/pages/Home'

// A route's script can fail to download (a connection drop, or a page tab left open across a redeploy). lazy() keeps that
// failure for good, so every later visit to the route would fail too. Reload once to start clean; if it fails again, the
// error state shows and the other pages keep working.
const load = <T,>(importer: () => Promise<T>) => () =>
  importer().catch((e: unknown) => {
    try {
      const last = Number(sessionStorage.getItem('ssl-route-reload') ?? 0)
      if (Date.now() - last > 15_000) {
        sessionStorage.setItem('ssl-route-reload', String(Date.now()))
        window.location.reload()
        return new Promise<never>(() => {})
      }
    } catch { /* storage blocked: show the error state */ }
    throw e
  })

// Home is eager (first paint); everything else is split per route.
const Products = lazy(load(() => import('@/pages/Products')))
const ProductDetail = lazy(load(() => import('@/pages/ProductDetail')))
const Services = lazy(load(() => import('@/pages/Services')))
const About = lazy(load(() => import('@/pages/About')))
const Contact = lazy(load(() => import('@/pages/Contact')))
const Blog = lazy(load(() => import('@/pages/Blog')))
const Article = lazy(load(() => import('@/pages/Article')))
const Legal = lazy(load(() => import('@/pages/Legal')))
const NotFound = lazy(load(() => import('@/pages/NotFound')))

export default function App() {
  return (
    <Boundary fallback={<ErrorState title="This page could not load" body="Check your connection and reload the page." />}>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            {/* SiteVision moved from /products/sitevision. nginx sends the permanent 301; this covers in-app navigation. */}
            <Route path="products/sitevision" element={<Navigate to="/products/site-vision" replace />} />
            <Route path="products/:slug" element={<ProductDetail />} />
            <Route path="services" element={<Services />} />
            <Route path="about" element={<About />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<Article />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy" element={<Legal doc="privacy" />} />
            <Route path="terms" element={<Legal doc="terms" />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </Boundary>
  )
}
