'use client'

import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 text-center">
      <div className="max-w-sm space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-2xl">
          ⚠️
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">
          Algo deu errado
        </h1>
        <p className="text-sm text-zinc-600">
          Não conseguimos carregar o formulário agora. Tente novamente em alguns segundos.
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          Tentar de novo
        </button>
      </div>
    </main>
  )
}
