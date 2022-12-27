import solid from 'solid-start/vite'
// @ts-expect-error no typing
import vercel from 'solid-start-vercel'
import { defineConfig } from 'vite'
import dotenv from 'dotenv'
dotenv.config()

export default defineConfig(() => ({
  plugins: [solid({ adapter: vercel() })],
  envPrefix: ['START_', 'VERCEL'],
}))
