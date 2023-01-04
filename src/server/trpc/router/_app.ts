import { t } from '../utils'
import exampleRouter from './example'
import githubRouter from './github'
import shoppingRouter from './products'

export const appRouter = t.mergeRouters(exampleRouter, githubRouter, shoppingRouter)

export type AppRouter = typeof appRouter
