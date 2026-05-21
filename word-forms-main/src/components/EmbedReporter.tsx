'use client'

import { ReactNode, useEffect, useRef } from 'react'

const MESSAGE_TYPE = 'lead-form:resize'

export function EmbedReporter({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.parent === window) return // not embedded
    const el = ref.current
    if (!el) return

    let lastHeight = 0
    const report = () => {
      const next = Math.ceil(el.getBoundingClientRect().height)
      if (next > 0 && next !== lastHeight) {
        lastHeight = next
        window.parent.postMessage({ type: MESSAGE_TYPE, height: next }, '*')
      }
    }

    const ro = new ResizeObserver(report)
    ro.observe(el)
    report()
    // Re-report after fonts/images settle
    const t1 = window.setTimeout(report, 300)
    const t2 = window.setTimeout(report, 1200)

    return () => {
      ro.disconnect()
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])

  return (
    <div ref={ref} className="flex flex-col">
      {children}
    </div>
  )
}
