import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest } from 'next/server';
import { rateLimitResponse } from './api-utils';

// Create Redis instance for rate limiting
// For development, we'll use a memory store
// In production, you should configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : undefined;

// Rate limiting configurations
const rateLimiters = {
  // General API rate limit - 100 requests per minute
  api: new Ratelimit({
    redis: redis as any || new Map(), // Type assertion for development fallback
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
    prefix: 'ratelimit:api',
  }),

  // Authentication endpoints - 10 requests per minute
  auth: new Ratelimit({
    redis: redis as any || new Map(),
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
    prefix: 'ratelimit:auth',
  }),

  // Search/marketplace endpoints - 200 requests per minute  
  search: new Ratelimit({
    redis: redis as any || new Map(),
    limiter: Ratelimit.slidingWindow(200, '1 m'),
    analytics: true,
    prefix: 'ratelimit:search',
  }),

  // Cargo creation - 20 requests per hour
  cargo: new Ratelimit({
    redis: redis as any || new Map(),
    limiter: Ratelimit.slidingWindow(20, '1 h'),
    analytics: true,
    prefix: 'ratelimit:cargo',
  }),

  // Quote submission - 50 requests per hour
  quotes: new Ratelimit({
    redis: redis as any || new Map(),
    limiter: Ratelimit.slidingWindow(50, '1 h'),
    analytics: true,
    prefix: 'ratelimit:quotes',
  }),

  // Chat messages - 500 requests per hour
  chat: new Ratelimit({
    redis: redis as any || new Map(),
    limiter: Ratelimit.slidingWindow(500, '1 h'),
    analytics: true,
    prefix: 'ratelimit:chat',
  }),
};

export type RateLimitType = keyof typeof rateLimiters;

export async function checkRateLimit(
  request: NextRequest,
  type: RateLimitType = 'api'
) {
  const rateLimiter = rateLimiters[type];
  
  // Get identifier - use user ID if authenticated, otherwise IP
  const userId = request.headers.get('x-user-id'); // Set by Clerk middleware
  const ip = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1';
  const identifier = userId || ip;

  const { success, limit, remaining, reset } = await rateLimiter.limit(identifier);

  // Add rate limit headers to response
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', limit.toString());
  headers.set('X-RateLimit-Remaining', remaining.toString());
  headers.set('X-RateLimit-Reset', new Date(reset).toISOString());

  if (!success) {
    return { 
      success: false, 
      response: rateLimitResponse('Rate limit exceeded. Please try again later.')
    };
  }

  return { success: true, headers };
}

export function withRateLimit(type: RateLimitType = 'api') {
  return function rateLimitDecorator(
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = async function (request: NextRequest, ...args: any[]) {
      const rateLimitResult = await checkRateLimit(request, type);
      
      if (!rateLimitResult.success) {
        return (rateLimitResult as any).response;
      }

      const response = await method.apply(this, [request, ...args]);
      
      // Add rate limit headers to successful responses
      if (response instanceof Response && rateLimitResult.headers) {
        rateLimitResult.headers.forEach((value, key) => {
          response.headers.set(key, value);
        });
      }

      return response;
    };

    return descriptor;
  };
}

// Helper function to get rate limit info without consuming a request
export async function getRateLimitInfo(
  request: NextRequest,
  type: RateLimitType = 'api'
) {
  const rateLimiter = rateLimiters[type];
  const userId = request.headers.get('x-user-id');
  const ip = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1';
  const identifier = userId || ip;

  // This doesn't consume a request, just gets info
  const result = await rateLimiter.getRemaining(identifier);
  return result;
}