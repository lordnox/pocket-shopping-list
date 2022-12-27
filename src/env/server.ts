import { formatErrors, serverScheme } from './schema'

const env = serverScheme.safeParse(process.env)

if (env.success === false) {
  console.error('❌ Invalid server environment variables:\n', ...formatErrors(env.error.format()))
  throw new Error('Invalid environment variables')
}

export const serverEnv = env.data
