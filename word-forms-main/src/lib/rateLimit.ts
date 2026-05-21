// Simple in-memory sliding-window rate limit (per process).
// MVP-only: replace with Upstash Redis (or similar) when running on
// multi-instance / serverless edge.

const buckets = new Map<string, number[]>()

export type RateLimitOptions = {
  windowMs: number
  max: number
}

export function consume(key: string, opts: RateLimitOptions): boolean {
  const now = Date.now()
  const cutoff = now - opts.windowMs
  const entries = (buckets.get(key) ?? []).filter((t) => t > cutoff)
  if (entries.length >= opts.max) {
    buckets.set(key, entries)
    return false
  }
  entries.push(now)
  buckets.set(key, entries)
  return true
}
