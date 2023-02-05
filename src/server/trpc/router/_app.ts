import { t } from '../utils'
import productRouter from './products'
import stockRouter from './stock'

export const appRouter = t.mergeRouters(productRouter, stockRouter)

export type AppRouter = typeof appRouter
