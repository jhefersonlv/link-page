import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, submitLead } from '@/lib/apiServer'
import { consume } from '@/lib/rateLimit'
import { submitPayloadSchema } from '@/lib/schemas'

const requestSchema = submitPayloadSchema.extend({
  subdomain: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]{3,40}$/)
})

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: parsed.error.issues[0]?.message ?? 'Invalid payload',
        issues: parsed.error.issues
      },
      { status: 400 }
    )
  }

  const ip = clientIp(request)
  if (!consume(`submit:${ip}`, { windowMs: 60 * 60 * 1000, max: 5 })) {
    return NextResponse.json(
      { message: 'Muitas tentativas. Tente novamente em alguns minutos.' },
      { status: 429 }
    )
  }

  try {
    await submitLead(parsed.data.subdomain, {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      flagTagIds: parsed.data.flagTagIds,
      metadata: {
        ip,
        userAgent: request.headers.get('user-agent'),
        referer: request.headers.get('referer')
      }
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status >= 500 ? 502 : err.status }
      )
    }
    console.error('submit failed', err)
    return NextResponse.json(
      { message: 'Erro ao enviar' },
      { status: 502 }
    )
  }
}

function clientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp
  return 'unknown'
}
