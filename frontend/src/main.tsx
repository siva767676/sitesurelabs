import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '@/styles/global.css'
import App from './App'

// A rebuilt or redeployed site no longer has the previous build's script files. A tab opened before that still asks
// for them when a lazy part loads (the 3D scenes, GSAP), gets a 404, and those animations drop to their static
// versions. Reload once to pick up the current build. The timestamp stops a reload loop if a file is really missing,
// and without storage nothing reloads: the static versions are shown instead.
window.addEventListener('vite:preloadError', () => {
  try {
    const last = Number(sessionStorage.getItem('ssl-build-reload') ?? 0)
    if (Date.now() - last < 15_000) return
    sessionStorage.setItem('ssl-build-reload', String(Date.now()))
  } catch {
    return
  }
  window.location.reload()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
