import { t } from '../utils'
import exampleRouter from './example'
import githubRouter from './github'

export const appRouter = t.mergeRouters(exampleRouter, githubRouter)

export type AppRouter = typeof appRouter
