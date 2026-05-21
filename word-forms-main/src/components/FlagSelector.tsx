'use client'

import { clsx } from 'clsx'
import type { LeadFormFlag } from '@/lib/apiServer'

type Props = {
  flags: LeadFormFlag[]
  selected: string[]
  onToggle: (id: string) => void
  onConfirm: () => void
  disabled?: boolean
}

export function FlagSelector({ flags, selected, onToggle, onConfirm, disabled }: Props) {
  if (flags.length === 0) {
    return (
      <button
        type="button"
        onClick={onConfirm}
        disabled={disabled}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--brand,#6366F1)] px-4 py-3 text-[15px] font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continuar
      </button>
    )
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {flags.map((flag) => {
          const isSelected = selected.includes(flag.id)
          return (
            <button
              key={flag.id}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(flag.id)}
              className={clsx(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all',
                isSelected
                  ? 'bg-[var(--brand,#6366F1)] text-white shadow-sm ring-2 ring-[var(--brand,#6366F1)]'
                  : 'bg-white text-zinc-700 ring-1 ring-zinc-200 hover:ring-zinc-300',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              <span
                aria-hidden
                className={clsx(
                  'h-2.5 w-2.5 rounded-full',
                  isSelected ? 'bg-white' : 'bg-zinc-300'
                )}
                style={!isSelected && flag.color ? { backgroundColor: flag.color } : undefined}
              />
              {flag.label}
            </button>
          )
        })}
      </div>
      <button
        type="button"
        onClick={onConfirm}
        disabled={disabled}
        className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-[var(--brand,#6366F1)] px-4 py-3 text-[15px] font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {selected.length === 0 ? 'Pular' : 'Enviar'}
      </button>
    </div>
  )
}
