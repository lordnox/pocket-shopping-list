import { clientScheme, formatErrors } from './schema'

const env = clientScheme.safeParse(import.meta.env)

if (env.success === false) {
  console.error('❌ Invalid client environment variables:\n', ...formatErrors(env.error.format()))
  console.log(import.meta.env)
  throw new Error('Invalid environment variables')
}

export const clientEnv = env.data
