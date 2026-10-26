/**
 * Responsive candidates for a product still. Every `/media/stills/<name>.webp` (1920 px wide) has
 * `<name>-1280.webp` and `<name>-960.webp` beside it (scripts/encode-media.sh builds them), so a phone
 * downloads roughly a third to a half of the bytes. Pair the result with a `sizes` attribute that says how
 * wide the image is drawn; without `sizes` the browser assumes the full viewport width.
 *
 * Returns nothing for any other kind of image, which then loads as a plain `src`.
 */
export function stillSet(src: string): { srcSet?: string } {
  if (!/\/media\/stills\/[^/]+\.webp$/.test(src)) return {}
  const base = src.replace(/\.webp$/, '')
  return { srcSet: `${base}-960.webp 960w, ${base}-1280.webp 1280w, ${src} 1920w` }
}
