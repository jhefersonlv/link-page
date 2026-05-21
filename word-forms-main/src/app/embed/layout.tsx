import type { ReactNode } from 'react'

// Reseta o min-h do body raiz para o iframe ter altura sob medida.
const EMBED_RESET = `
  body { min-height: 0 !important; height: auto !important; background: transparent !important; }
  html { background: transparent !important; }
`

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: EMBED_RESET }} />
      {children}
    </>
  )
}
