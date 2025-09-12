// src/lib/rate-limit.ts
import { NextRequest, NextResponse } from 'next/server';

// ===== Config =====
const DISABLE_IN_DEV = process.env.ENABLE_RATE_LIMIT === '1' ? false : true;

// dacă vrei să forțezi rate-limit și în dev, pune ENABLE_RATE_LIMIT=1 în .env.local
// producție: lasă ENABLE_RATE_LIMIT nedefinit și configurează Upstash dacă vrei.

// ===== Interfața comună =====
type LimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // ms epoch
};

interface Limiter {
  limit(key: string): Promise<LimitResult>;
}

// ===== Implementare memorie (dev & fallback) =====
class MemoryLimiter implements Limiter {
  private store = new Map<string, { count: number; resetAt: number }>();

  constructor(private max: number, private windowMs: number) {}

  async limit(key: string): Promise<LimitResult> {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || entry.resetAt <= now) {
      this.store.set(key, { count: 1, resetAt: now + this.windowMs });
      return { success: true, limit: this.max, remaining: this.max - 1, reset: now + this.windowMs };
    }

    if (entry.count < this.max) {
      entry.count += 1;
      return { success: true, limit: this.max, remaining: this.max - entry.count, reset: entry.resetAt };
    }

    return { success: false, limit: this.max, remaining: 0, reset: entry.resetAt };
  }
}

// ===== (Opțional) Upstash în producție =====
// NOTE: folosește doar dacă ai setat UPSTASH_REDIS_REST_URL și UPSTASH_REDIS_REST_TOKEN
let useUpstash = false;
let UpstashLimiterFactory: ((max: number, windowMs: number) => Limiter) | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN && process.env.NODE_ENV === 'production') {
  try {
    // Lazy require ca să nu crape în dev
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Ratelimit } = require('@upstash/ratelimit');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Redis } = require('@upstash/redis');

    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    UpstashLimiterFactory = (max: number, windowMs: number): Limiter => {
      const rl = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(max, `${Math.ceil(windowMs / 1000)} s`),
        analytics: true,
        prefix: 'ratelimit',
      });

      return {
        async limit(key: string): Promise<LimitResult> {
          const r = await rl.limit(key);
          return { success: r.success, limit: r.limit, remaining: r.remaining, reset: r.reset };
        },
      };
    };

    useUpstash = true;
  } catch {
    useUpstash = false;
  }
}

// ===== Instanțe =====
function makeLimiter(max: number, windowMs: number): Limiter {
  if (useUpstash && UpstashLimiterFactory) return UpstashLimiterFactory(max, windowMs);
  return new MemoryLimiter(max, windowMs);
}

const rateLimiters = {
  api: makeLimiter(100, 60_000),        // 100 / 1m
  auth: makeLimiter(10, 60_000),        // 10 / 1m
  search: makeLimiter(200, 60_000),     // 200 / 1m
  cargo: makeLimiter(20, 60 * 60_000),  // 20 / 1h
  quotes: makeLimiter(50, 60 * 60_000), // 50 / 1h
  chat: makeLimiter(500, 60 * 60_000),  // 500 / 1h
};

export type RateLimitType = keyof typeof rateLimiters;

function clientId(req: NextRequest) {
  // IP simplu; ajustează dacă folosești proxy/CDN
  const xff = req.headers.get('x-forwarded-for');
  const ip = xff?.split(',')[0]?.trim() || (req as any).ip || 'anon';
  return ip;
}

export async function checkRateLimit(req: NextRequest, type: RateLimitType = 'api') {
  // dezactivat implicit în dev (dacă nu setezi ENABLE_RATE_LIMIT=1)
  if (process.env.NODE_ENV === 'development' && DISABLE_IN_DEV) {
    return { success: true, headers: new Headers() as Headers, response: undefined as NextResponse | undefined };
  }

  const limiter = rateLimiters[type];
  if (!limiter || typeof limiter.limit !== 'function') {
    // protecție suplimentară: nu mai lăsăm să crape rutele
    return { success: true, headers: new Headers(), response: undefined };
  }

  const id = `${type}:${clientId(req)}`;
  const res = await limiter.limit(id);

  const headers = new Headers({
    'X-RateLimit-Limit': String(res.limit),
    'X-RateLimit-Remaining': String(res.remaining),
    'X-RateLimit-Reset': String(Math.ceil(res.reset / 1000)), // secunde epoch
  });

  if (!res.success) {
    return {
      success: false,
      headers,
      response: new NextResponse(
        JSON.stringify({ success: false, error: 'Too many requests', reset: res.reset }),
        { status: 429, headers }
      ),
    };
  }

  return { success: true, headers, response: undefined };
}