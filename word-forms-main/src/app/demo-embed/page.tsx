import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'word-forms · embed dev preview',
  description: 'Preview do widget embedável para devs de landing page'
}

async function resolveOrigin(): Promise<string> {
  const hdrs = await headers()
  const host = hdrs.get('host') ?? 'localhost:3100'
  const proto = hdrs.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}

export default async function DemoEmbedPage() {
  const origin = await resolveOrigin()
  const scriptTag = `<script src="${origin}/embed.js" data-form="demo" async></script>`
  const widgetTag = `<script
  src="${origin}/embed.js"
  data-form="demo"
  data-mode="bubble"
  data-position="bottom-right"
  data-color="#9d174d"
  data-label="Fale com a gente"
  async
></script>`
  const iframeTag = `<iframe src="${origin}/embed/demo" style="border:0;width:100%;height:600px" loading="lazy" title="Formulário de contato"></iframe>`

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-10">
      <header className="space-y-2">
        <span className="inline-flex w-fit items-center rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
          dev preview
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Embedando o formulário em uma landing page
        </h1>
        <p className="text-sm text-zinc-600">
          Use os snippets abaixo na landing. O iframe redimensiona automaticamente conforme o
          conteúdo do form. <code className="rounded bg-zinc-100 px-1.5 py-0.5">data-form</code>{' '}
          é o subdomínio configurado no CRM para esse cliente.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          1. Inline (form embedado direto na p&aacute;gina, com auto-resize)
        </h2>
        <pre className="overflow-x-auto rounded-xl bg-zinc-900 px-4 py-3 text-[13px] leading-relaxed text-zinc-100">
          <code>{scriptTag}</code>
        </pre>
        <p className="text-xs text-zinc-600">
          Atributos opcionais:{' '}
          <code className="rounded bg-zinc-100 px-1 py-0.5">data-min-height</code> (default 480),{' '}
          <code className="rounded bg-zinc-100 px-1 py-0.5">data-max-height</code> (default 900),{' '}
          <code className="rounded bg-zinc-100 px-1 py-0.5">data-host</code> (override do host).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          2. Widget bubble (bot&atilde;o flutuante no canto da p&aacute;gina)
        </h2>
        <pre className="overflow-x-auto rounded-xl bg-zinc-900 px-4 py-3 text-[13px] leading-relaxed text-zinc-100">
          <code>{widgetTag}</code>
        </pre>
        <p className="text-xs text-zinc-600">
          Atributos exclusivos do modo bubble:{' '}
          <code className="rounded bg-zinc-100 px-1 py-0.5">data-mode="bubble"</code>,{' '}
          <code className="rounded bg-zinc-100 px-1 py-0.5">data-position</code>{' '}
          (<code>bottom-right</code> ou <code>bottom-left</code>),{' '}
          <code className="rounded bg-zinc-100 px-1 py-0.5">data-color</code> (cor do bot&atilde;o),{' '}
          <code className="rounded bg-zinc-100 px-1 py-0.5">data-label</code> (texto opcional ao lado do &iacute;cone).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          3. Iframe direto (fallback sem JS)
        </h2>
        <pre className="overflow-x-auto rounded-xl bg-zinc-900 px-4 py-3 text-[13px] leading-relaxed text-zinc-100">
          <code>{iframeTag}</code>
        </pre>
        <p className="text-xs text-zinc-600">
          Sem auto-resize. Use só se a CSP da landing bloquear scripts externos.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Preview do form (subdomínio <code>demo</code>)
        </h2>
        <div className="overflow-hidden rounded-xl ring-1 ring-zinc-200">
          <iframe
            src={`${origin}/embed/demo`}
            style={{ border: 0, width: '100%', height: 640, display: 'block', background: 'transparent' }}
            loading="lazy"
            title="Preview do formulário"
          />
        </div>
        <p className="text-xs text-zinc-500">
          Em produção, o script tag injeta um iframe equivalente e cuida do auto-resize.
        </p>
      </section>

      <section className="space-y-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
        <p className="font-medium">Setup local na máquina do dev da landing page</p>
        <ol className="ml-5 list-decimal space-y-1 text-amber-900/90">
          <li>
            Clonar o repo <code className="rounded bg-amber-100 px-1">word-forms</code>, instalar
            deps (<code className="rounded bg-amber-100 px-1">pnpm install</code>).
          </li>
          <li>
            Copiar <code className="rounded bg-amber-100 px-1">.env.local.example</code> →{' '}
            <code className="rounded bg-amber-100 px-1">.env.local</code> e pedir as credenciais
            (ou usar <code className="rounded bg-amber-100 px-1">FORMS_MOCK_CONFIG=true</code> pra
            testar sem a API).
          </li>
          <li>
            Rodar <code className="rounded bg-amber-100 px-1">pnpm dev</code>. O word-forms sobe em{' '}
            <code className="rounded bg-amber-100 px-1">http://localhost:3100</code>.
          </li>
          <li>
            Na landing local, colar o snippet trocando o host por{' '}
            <code className="rounded bg-amber-100 px-1">http://localhost:3100</code>.
          </li>
        </ol>
      </section>
    </main>
  )
}
