'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { FlagSelector } from './FlagSelector'
import type { LeadFormConfig } from '@/lib/apiServer'
import { emailSchema, nameSchema, phoneSchema } from '@/lib/schemas'

type Step = 'name' | 'email' | 'phone' | 'flags' | 'submitting' | 'success' | 'error'

type Props = {
  config: LeadFormConfig
  subdomain: string
}

type Message =
  | { kind: 'assistant'; content: string }
  | { kind: 'user'; content: string }

export function ConversationalForm({ config, subdomain }: Props) {
  const brandColor = config.form.primaryColor ?? config.tenant.primaryColor ?? '#6366F1'

  const [messages, setMessages] = useState<Message[]>(() => [
    { kind: 'assistant', content: config.form.welcomeMessage },
    { kind: 'assistant', content: 'Pra começar, qual é o seu nome?' }
  ])
  const [step, setStep] = useState<Step>('name')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [flagsSelected, setFlagsSelected] = useState<string[]>([])

  // Ensure mobile viewport keeps the input visible above the keyboard
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return
    function syncViewport() {
      const vh = window.visualViewport?.height ?? window.innerHeight
      document.documentElement.style.setProperty('--app-vh', `${vh}px`)
    }
    syncViewport()
    window.visualViewport.addEventListener('resize', syncViewport)
    return () => window.visualViewport?.removeEventListener('resize', syncViewport)
  }, [])

  function appendAssistant(content: string) {
    setMessages((prev) => [...prev, { kind: 'assistant', content }])
  }

  function appendUser(content: string) {
    setMessages((prev) => [...prev, { kind: 'user', content }])
  }

  function handleName(raw: string) {
    const parsed = nameSchema.safeParse(raw)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Nome inválido')
      return
    }
    setError(null)
    setName(parsed.data)
    appendUser(parsed.data)
    appendAssistant(`Prazer, ${parsed.data.split(' ')[0]}! 👋 Qual seu melhor e-mail?`)
    setStep('email')
  }

  function handleEmail(raw: string) {
    const parsed = emailSchema.safeParse(raw)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'E-mail inválido')
      return
    }
    setError(null)
    setEmail(parsed.data)
    appendUser(parsed.data)
    appendAssistant('Perfeito. E o seu WhatsApp (com DDD)?')
    setStep('phone')
  }

  function handlePhone(raw: string) {
    const parsed = phoneSchema.safeParse(raw)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Telefone inválido')
      return
    }
    setError(null)
    setPhone(parsed.data)
    appendUser(raw)
    if (config.form.flags.length > 0) {
      appendAssistant('Por último: marque o que mais te interessa (ou pule):')
      setStep('flags')
    } else {
      void submit(parsed.data, [])
    }
  }

  function toggleFlag(id: string) {
    setFlagsSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  async function submit(phoneToSend = phone, flagIds = flagsSelected) {
    setStep('submitting')
    setError(null)
    appendAssistant('Enviando...')
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          subdomain,
          name,
          email,
          phone: phoneToSend,
          flagTagIds: flagIds
        })
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { message?: string }
          | null
        throw new Error(data?.message ?? `Erro ${res.status}`)
      }
      appendAssistant(config.form.successMessage)
      setStep('success')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(message)
      appendAssistant('Algo deu errado ao enviar. Pode tentar de novo?')
      setStep('error')
    }
  }

  const placeholder = useMemo(() => {
    if (step === 'name') return 'Digite seu nome'
    if (step === 'email') return 'seu@email.com'
    if (step === 'phone') return '(11) 99999-9999'
    return ''
  }, [step])

  const onInputSubmit = (value: string) => {
    if (step === 'name') return handleName(value)
    if (step === 'email') return handleEmail(value)
    if (step === 'phone') return handlePhone(value)
  }

  const showInput = step === 'name' || step === 'email' || step === 'phone'
  const showFlags = step === 'flags'
  const isBusy = step === 'submitting'
  const showRetry = step === 'error'

  return (
    <div
      className="flex w-full flex-1 flex-col"
      style={{ ['--brand' as string]: brandColor }}
    >
      <header className="flex items-center gap-3 border-b border-zinc-200/70 bg-white/80 px-4 py-3 backdrop-blur sm:px-6">
        {config.form.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={config.form.logoUrl}
            alt={config.tenant.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: brandColor }}
          >
            {config.tenant.name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-zinc-900">{config.tenant.name}</span>
          <span className="text-xs text-zinc-500">Está digitando...</span>
        </div>
      </header>

      <main
        className="flex flex-1 flex-col gap-2 overflow-y-auto bg-zinc-50 px-4 py-4 sm:px-6"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} variant={msg.kind} delay={idx === messages.length - 1 ? 0.05 : 0}>
              {msg.content}
            </ChatBubble>
          ))}
        </AnimatePresence>
      </main>

      <footer className="border-t border-zinc-200/70 bg-white/80 px-4 py-3 backdrop-blur sm:px-6">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 text-sm text-rose-600"
          >
            {error}
          </motion.p>
        )}
        {showInput && (
          <ChatInput
            placeholder={placeholder}
            type={step === 'email' ? 'email' : step === 'phone' ? 'tel' : 'text'}
            disabled={isBusy}
            onSubmit={onInputSubmit}
          />
        )}
        {showFlags && (
          <FlagSelector
            flags={config.form.flags}
            selected={flagsSelected}
            onToggle={toggleFlag}
            onConfirm={() => submit()}
            disabled={isBusy}
          />
        )}
        {showRetry && (
          <button
            type="button"
            onClick={() => submit()}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--brand,#6366F1)] px-4 py-3 text-[15px] font-medium text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Tentar novamente
          </button>
        )}
        {step === 'success' && (
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-200">
            ✅ Pronto! Você pode fechar essa janela.
          </div>
        )}
      </footer>
    </div>
  )
}
