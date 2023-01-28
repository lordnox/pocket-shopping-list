import { CompareFn } from '~/utils/list-comparison'
import { RouterInput, RouterOutput } from '~/utils/trpc-client'

export type StockList = RouterOutput['stockLists'][number] & {
  optimistic?: boolean
}

export type CreateStockList = RouterInput['createStockList']

export const stockListCompare: CompareFn<StockList> = (a, b) => {
  if (a.id !== b.id) return -1
  if (a.name !== b.name) return -1
  return 0
}

export const updateStockList = (product: StockList, changes: CreateStockList): StockList => ({
  ...product,
  optimistic: true,
  name: changes.name,
  icon: changes.icon ?? null,
})
