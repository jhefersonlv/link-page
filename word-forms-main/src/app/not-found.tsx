export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 text-center">
      <div className="max-w-sm space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-200 text-2xl">
          👀
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">
          Formulário não encontrado
        </h1>
        <p className="text-sm text-zinc-600">
          Confira se o link está correto ou peça um novo para a equipe.
        </p>
      </div>
    </main>
  )
}
