export function extractSubdomain(host: string | null | undefined): string | null {
  if (!host) return null
  const baseDomain = (process.env.FORMS_BASE_DOMAIN ?? '').toLowerCase()
  const hostWithoutPort = host.toLowerCase().split(':')[0]

  if (baseDomain && hostWithoutPort === baseDomain) return null
  if (baseDomain && hostWithoutPort.endsWith(`.${baseDomain}`)) {
    const sub = hostWithoutPort.slice(0, hostWithoutPort.length - baseDomain.length - 1)
    return sub && sub !== 'www' ? sub : null
  }

  // Fallback for local development: anything like sub.localhost
  if (hostWithoutPort.endsWith('.localhost')) {
    return hostWithoutPort.slice(0, hostWithoutPort.length - '.localhost'.length) || null
  }

  return null
}
