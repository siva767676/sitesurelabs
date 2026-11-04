import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Boundary, ErrorState, RouteFallback } from '@/components/ui/States'
import Home from '@/pages/Home'

// Home is eager (first paint); everything else is split per route.
const Products = lazy(() => import('@/pages/Products'))
const ProductDetail = lazy(() => import('@/pages/ProductDetail'))
const Services = lazy(() => import('@/pages/Services'))
const About = lazy(() => import('@/pages/About'))
const Contact = lazy(() => import('@/pages/Contact'))
const Blog = lazy(() => import('@/pages/Blog'))
const Article = lazy(() => import('@/pages/Article'))
const Legal = lazy(() => import('@/pages/Legal'))
const NotFound = lazy(() => import('@/pages/NotFound'))

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
