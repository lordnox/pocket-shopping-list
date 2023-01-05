import { t } from '../utils'
import shoppingRouter from './products'

export const appRouter = t.mergeRouters(shoppingRouter)

export type AppRouter = typeof appRouter
