import { z } from 'zod';

// Client-visible env vars (must start with NEXT_PUBLIC_)
const clientSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

// Server-only env vars
const serverSchema = z.object({
  OPENAI_API_KEY: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
});

const mergedSchema = clientSchema.merge(serverSchema);

export type ClientEnv = z.infer<typeof clientSchema>;
export type ServerEnv = z.infer<typeof mergedSchema>;

function getClientEnv(): ClientEnv {
  // In client bundles, Next.js replaces process.env.NEXT_PUBLIC_* at build time.
  const raw = {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  } as Partial<Record<keyof ClientEnv, string | undefined>>;

  const result = clientSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid environment configuration (client):\n${issues}`);
  }
  return result.data;
}

function getServerEnv(): ServerEnv {
  const result = mergedSchema.safeParse(process.env);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }
  return result.data;
}

export function getEnv(): ClientEnv | ServerEnv {
  const isServer = typeof window === 'undefined';
  return isServer ? getServerEnv() : getClientEnv();
}

export const env = getEnv();


