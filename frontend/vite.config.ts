import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { port: 5173, proxy: { '/api': 'http://127.0.0.1:8000' } },
  build: {
    // Never inline fonts as data: URIs: the production CSP (font-src 'self') would block them.
    assetsInlineLimit: (file) => (file.endsWith('.woff2') ? false : undefined),
    chunkSizeWarningLimit: 1000, // the lazy 3D chunk (three.js) is ~900 kB raw / ~245 kB gzip and never loads on first paint
  },
})
