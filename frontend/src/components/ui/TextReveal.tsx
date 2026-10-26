import { Fragment, useMemo } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { dur, ease, stagger } from '@/design/tokens'

interface TextRevealProps {
  /** One string per visual line. Wrap words in *asterisks* to accent them. */
  lines: string[]
  as?: 'h1' | 'h2' | 'h3' | 'p'
  id?: string
  className?: string
  /** 'char' = letter by letter, 'word' = word by word */
  by?: 'char' | 'word'
  delay?: number
  /** animate on mount instead of when scrolled into view */
  immediate?: boolean
}

interface Token { text: string; accent: boolean }

const parse = (line: string): Token[][] => {
  // -> array of words, each a list of accent-tagged pieces
  const pieces: Token[] = []
  line.split(/(\*[^*]+\*)/g).forEach((p) => {
    if (!p) return
    const accent = p.startsWith('*') && p.endsWith('*')
    pieces.push({ text: accent ? p.slice(1, -1) : p, accent })
  })
  const words: Token[][] = [[]]
  pieces.forEach((pc) => {
    pc.text.split(/(\s+)/).forEach((part) => {
      if (!part) return
      if (/^\s+$/.test(part)) words.push([])
      else words[words.length - 1].push({ text: part, accent: pc.accent })
    })
  })
  return words.filter((w) => w.length)
}

/** Accessible masked text reveal. The full sentence is exposed to assistive tech once via sr-only text;
 *  the animated glyph spans are aria-hidden. */
export function TextReveal({ lines, as = 'h2', id, className = '', by = 'word', delay = 0, immediate }: TextRevealProps) {
  const reduced = useReducedMotion()
  const Tag = motion[as]
  const plain = lines.map((l) => l.replace(/\*/g, '')).join(' ')
  const parsed = useMemo(() => lines.map(parse), [lines])

  if (reduced) {
    const Plain = as
    return (
      <Plain id={id} className={className}>
        {lines.map((l, i) => (
          <span key={i} className="block">
            {parse(l).map((w, wi) => (
              <Fragment key={wi}>
                {w.map((t, ti) => (<span key={ti} className={t.accent ? 'text-[var(--color-accent-display)]' : ''}>{t.text}</span>))}{' '}
              </Fragment>
            ))}
          </span>
        ))}
      </Plain>
    )
  }

  let n = 0
  const step = by === 'char' ? stagger.char : stagger.word
  // The trigger lives on the (unclipped) root: IntersectionObserver treats children hidden inside
  // overflow:hidden masks as invisible, so they must inherit the state instead of observing themselves.
  const trigger = immediate
    ? { initial: 'hidden', animate: 'show' }
    : { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } }

  return (
    <Tag id={id} className={className} {...trigger}>
      <span className="sr-only">{plain}</span>
      <span aria-hidden="true" className="block">
        {parsed.map((words, li) => (
          <span key={li} className="block">
            {words.map((word, wi) => (
              <Fragment key={wi}>
                <span className="inline-block overflow-hidden align-top" style={{ paddingBlock: '0.1em', marginBlock: '-0.1em' }}>
                  <span className="inline-block whitespace-nowrap">
                    {by === 'char'
                      ? word.flatMap((t) => Array.from(t.text).map((ch) => ({ ch, accent: t.accent }))).map((c, ci) => {
                          const d = delay + n++ * step
                          return (
                            <motion.span
                              key={ci}
                              className={`inline-block ${c.accent ? 'text-[var(--color-accent-display)]' : ''}`}
                              variants={{ hidden: { y: '112%', opacity: 0, rotate: 3 }, show: { y: '0%', opacity: 1, rotate: 0, transition: { duration: dur.slow, ease: ease.out, delay: d } } }}
                            >
                              {c.ch}
                            </motion.span>
                          )
                        })
                      : (() => {
                          const d = delay + n++ * step
                          return (
                            <motion.span
                              className="inline-block"
                              variants={{ hidden: { y: '112%', opacity: 0 }, show: { y: '0%', opacity: 1, transition: { duration: dur.slow, ease: ease.out, delay: d } } }}
                            >
                              {word.map((t, ti) => (<span key={ti} className={t.accent ? 'text-[var(--color-accent-display)]' : ''}>{t.text}</span>))}
                            </motion.span>
                          )
                        })()}
                  </span>
                </span>
                {wi < words.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </span>
        ))}
      </span>
    </Tag>
  )
}
