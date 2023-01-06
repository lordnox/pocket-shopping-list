import { t } from '../utils'
import productRouter from './products'

export const appRouter = t.mergeRouters(productRouter)

export type AppRouter = typeof appRouter
