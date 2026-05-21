import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { ConversationalForm } from '@/components/ConversationalForm'
import { fetchLeadFormConfig } from '@/lib/apiServer'
import { extractSubdomain } from '@/lib/subdomain'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const hdrs = await headers()
  const host = hdrs.get('host')
  const subdomain = extractSubdomain(host)
  if (!subdomain) notFound()

  const config = await fetchLeadFormConfig(subdomain)
  if (!config) notFound()

  return <ConversationalForm config={config} subdomain={subdomain} />
}
