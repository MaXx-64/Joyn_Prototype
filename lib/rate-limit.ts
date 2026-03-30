/**
 * Simple in-memory rate limiter for AI API routes.
 *
 * Limits per IP:
 *  - 10 requests per minute  (burst protection)
 *  - 60 requests per hour    (daily quota protection)
 *
 * This is an in-memory store — it resets on server restart.
 * For production, replace with Redis (e.g. Upstash).
 */

interface RateLimitEntry {
  minuteCount: number;
  minuteReset: number;
  hourCount: number;
  hourReset: number;
}

const store = new Map<string, RateLimitEntry>();

const MINUTE_LIMIT = 10;   // max requests per minute per IP
const HOUR_LIMIT   = 60;   // max requests per hour per IP

// Clean up stale entries every 10 minutes to avoid memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.hourReset < now) store.delete(key);
  }
}, 10 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  /** Human-readable reason, set only when blocked */
  reason?: string;
  /** Seconds until the limit resets */
  retryAfter?: number;
}

/**
 * Check and update the rate limit for a given IP.
 * Call this at the top of each AI route handler.
 */
export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();

  let entry = store.get(ip);

  if (!entry || entry.minuteReset < now) {
    const prevHourCount  = entry && entry.hourReset  > now ? entry.hourCount  : 0;
    const prevHourReset  = entry && entry.hourReset  > now ? entry.hourReset  : now + 3_600_000;
    entry = {
      minuteCount: 0,
      minuteReset: now + 60_000,
      hourCount:   prevHourCount,
      hourReset:   prevHourReset,
    };
  }

  // Check minute limit first (strict burst protection)
  if (entry.minuteCount >= MINUTE_LIMIT) {
    return {
      allowed: false,
      reason: `Too many requests. Please wait a moment before trying again.`,
      retryAfter: Math.ceil((entry.minuteReset - now) / 1000),
    };
  }

  // Check hour limit
  if (entry.hourCount >= HOUR_LIMIT) {
    return {
      allowed: false,
      reason: `You've reached the hourly limit. Please try again later.`,
      retryAfter: Math.ceil((entry.hourReset - now) / 1000),
    };
  }

  entry.minuteCount++;
  entry.hourCount++;
  store.set(ip, entry);

  return { allowed: true };
}

/**
 * Extract the real client IP from a Next.js request.
 * Handles reverse proxies (Vercel, Nginx, Cloudflare).
 */
export function getClientIp(req: Request): string {
  const headers = new Headers((req as Request).headers);
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
