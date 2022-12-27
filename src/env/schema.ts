import { isServer } from 'solid-js/web'
import { z, type ZodFormattedError } from 'zod'

export const formatErrors = (errors: ZodFormattedError<Map<string, string>, string>) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && '_errors' in value) return `${name}: ${value._errors.join(', ')}\n`
    })
    .filter(Boolean)

const START_BASE_URL = z.preprocess(
  // This makes Vercel deployments not fail if you don't set START_BASE_URL
  // Since NextAuth.js automatically uses the VERCEL_URL if present.
  (str) => {
    return (isServer ? process.env : import.meta.env).VERCEL_URL ?? str
  },
  // VERCEL_URL doesn't include `https` so it cant be validated as a URL
  (isServer ? process.env : import.meta.env).VERCEL ? z.string() : z.string().url(),
)

export const serverScheme = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  AUTH_TRUST_HOST: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  AUTH_SECRET: z.string(),
  DATABASE_URL: z.string(),
  START_BASE_URL,
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
})

export const clientScheme = z.object({
  MODE: z.enum(['development', 'production', 'test']).default('development'),
  START_BASE_URL,
})
