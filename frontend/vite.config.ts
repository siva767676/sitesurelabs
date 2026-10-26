import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// Hostnames the dev and preview servers accept besides localhost, so the site can be shared through a
// tunnel. Vite rejects any other Host header (DNS-rebinding protection). Add more without editing this file:
//   ALLOWED_HOSTS=my-tunnel.example.com,other.example.com npm run dev
const allowedHosts = [
  'greedily-sessions-thrift.ngrok-free.dev', // ngrok tunnel to this dev server
  ...(process.env.ALLOWED_HOSTS?.split(',').map((h) => h.trim()).filter(Boolean) ?? []),
]

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  // API_PROXY lets you point the dev server at another backend, e.g. API_PROXY=http://127.0.0.1:8001 npm run dev
  server: { port: 5173, allowedHosts, proxy: { '/api': process.env.API_PROXY ?? 'http://127.0.0.1:8000' } },
  preview: { allowedHosts },
  build: {
    // Never inline fonts as data: URIs: the production CSP (font-src 'self') would block them.
    assetsInlineLimit: (file) => (file.endsWith('.woff2') ? false : undefined),
    chunkSizeWarningLimit: 1000, // the lazy 3D chunk (three.js) is ~900 kB raw / ~245 kB gzip and never loads on first paint
  },
})
