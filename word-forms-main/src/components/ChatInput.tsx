'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'

type Props = {
  placeholder: string
  type?: 'text' | 'email' | 'tel'
  autoFocus?: boolean
  disabled?: boolean
  onSubmit: (value: string) => void
}

export function ChatInput({
  placeholder,
  type = 'text',
  autoFocus = true,
  disabled = false,
  onSubmit
}: Props) {
  const [value, setValue] = useState('')
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) ref.current?.focus()
  }, [autoFocus])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (disabled) return
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setValue('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-zinc-200 focus-within:ring-2 focus-within:ring-[var(--brand,#6366F1)]"
    >
      <input
        ref={ref}
        type={type}
        inputMode={type === 'tel' ? 'tel' : type === 'email' ? 'email' : 'text'}
        autoCapitalize={type === 'email' ? 'none' : 'sentences'}
        autoCorrect={type === 'email' ? 'off' : 'on'}
        autoComplete={
          type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'name'
        }
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 bg-transparent text-[16px] text-zinc-900 outline-none placeholder:text-zinc-400 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand,#6366F1)] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Enviar"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      </button>
    </form>
  )
}
