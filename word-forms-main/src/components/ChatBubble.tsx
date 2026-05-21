'use client'

import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { ReactNode } from 'react'

type Props = {
  variant?: 'assistant' | 'user'
  children: ReactNode
  delay?: number
}

export function ChatBubble({ variant = 'assistant', children, delay = 0 }: Props) {
  const isAssistant = variant === 'assistant'
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className={clsx(
        'max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm',
        isAssistant
          ? 'self-start rounded-bl-md bg-white text-zinc-900 ring-1 ring-zinc-200'
          : 'self-end rounded-br-md bg-[var(--brand,#6366F1)] text-white'
      )}
    >
      {children}
    </motion.div>
  )
}
