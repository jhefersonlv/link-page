import { notFound } from 'next/navigation'
import { ConversationalForm } from '@/components/ConversationalForm'
import { EmbedReporter } from '@/components/EmbedReporter'
import { fetchLeadFormConfig } from '@/lib/apiServer'

export const dynamic = 'force-dynamic'

export default async function EmbedPage({
  params,
  searchParams
}: {
  params: Promise<{ subdomain: string }>
  searchParams: Promise<{ fill?: string }>
}) {
  const { subdomain } = await params
  const sp = await searchParams
  const fill = sp.fill === '1' || sp.fill === 'true'
  const normalized = subdomain.trim().toLowerCase()
  if (!/^[a-z0-9-]{3,40}$/.test(normalized)) notFound()

  const config = await fetchLeadFormConfig(normalized)
  if (!config) notFound()

  if (fill) {
    // Altura travada (ex.: widget bubble): main scrolla, footer ancorado no bottom.
    return (
      <div className="flex h-dvh w-full flex-col">
        <ConversationalForm config={config} subdomain={normalized} />
      </div>
    )
  }

  // Altura sob demanda (modo inline): conteúdo cresce, iframe redimensiona via postMessage.
  return (
    <EmbedReporter>
      <ConversationalForm config={config} subdomain={normalized} />
    </EmbedReporter>
  )
}
