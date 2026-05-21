import 'server-only'

const baseUrl = (process.env.WORD_API_BASE_URL ?? '').replace(/\/$/, '')
const apiKey = process.env.WORD_API_FORMS_KEY ?? ''
const apiSecret = process.env.WORD_API_FORMS_SECRET ?? ''
const mockEnabled = process.env.FORMS_MOCK_CONFIG === 'true'

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
  }
}

function ensureConfigured() {
  if (mockEnabled) return
  if (!baseUrl) throw new Error('WORD_API_BASE_URL is not configured')
  if (!apiKey || !apiSecret) throw new Error('WORD_API_FORMS_KEY/SECRET are not configured')
}

function headers() {
  return {
    'x-api-key': apiKey,
    'x-api-secret': apiSecret,
    'content-type': 'application/json'
  }
}

async function unwrap<T>(res: Response): Promise<T> {
  if (res.ok) return (await res.json()) as T
  let message = res.statusText
  try {
    const data = (await res.json()) as { message?: string }
    if (data?.message) message = data.message
  } catch {
    // ignore
  }
  throw new ApiError(res.status, message)
}

export const apiServer = {
  async get<T>(path: string): Promise<T> {
    ensureConfigured()
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'GET',
      headers: headers(),
      cache: 'no-store'
    })
    return unwrap<T>(res)
  },
  async post<T>(path: string, body: unknown): Promise<T> {
    ensureConfigured()
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
      cache: 'no-store'
    })
    return unwrap<T>(res)
  },
  isMockEnabled(): boolean {
    return mockEnabled
  }
}

export type LeadFormFlag = {
  id: string
  label: string
  order: number
  icon: string | null
  color: string | null
}

export type LeadFormConfig = {
  tenant: {
    name: string
    logoUrl: string | null
    primaryColor: string | null
  }
  form: {
    welcomeMessage: string
    successMessage: string
    primaryColor: string | null
    logoUrl: string | null
    flags: LeadFormFlag[]
  }
}

export async function fetchLeadFormConfig(subdomain: string): Promise<LeadFormConfig | null> {
  if (apiServer.isMockEnabled()) return mockConfig(subdomain)
  try {
    return await apiServer.get<LeadFormConfig>(
      `/v1/lead-forms/by-subdomain/${encodeURIComponent(subdomain)}/config`
    )
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.status === 403)) {
      return null
    }
    throw err
  }
}

export async function submitLead(
  subdomain: string,
  payload: {
    name: string
    email: string
    phone: string
    flagTagIds?: string[]
    metadata?: { ip?: string | null; userAgent?: string | null; referer?: string | null }
  }
): Promise<{ ok: true }> {
  if (apiServer.isMockEnabled()) return { ok: true }
  return apiServer.post<{ ok: true }>(
    `/v1/lead-forms/by-subdomain/${encodeURIComponent(subdomain)}/leads`,
    payload
  )
}

function mockConfig(subdomain: string): LeadFormConfig {
  return {
    tenant: {
      name: `Demo (${subdomain})`,
      logoUrl: null,
      primaryColor: '#6366F1'
    },
    form: {
      welcomeMessage: 'Olá! Vou te fazer 3 perguntinhas rápidas, tudo bem?',
      successMessage: 'Obrigado! Em breve nossa equipe entra em contato.',
      primaryColor: '#6366F1',
      logoUrl: null,
      flags: [
        {
          id: 'mock-tag-1',
          label: 'Quero saber de promoções',
          order: 1,
          icon: null,
          color: '#F97316'
        },
        {
          id: 'mock-tag-2',
          label: 'Avisem sobre novidades',
          order: 2,
          icon: null,
          color: '#3B82F6'
        },
        {
          id: 'mock-tag-3',
          label: 'Quero cupom exclusivo',
          order: 3,
          icon: null,
          color: '#10B981'
        }
      ]
    }
  }
}
