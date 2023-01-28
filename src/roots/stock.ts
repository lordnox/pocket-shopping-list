import { createRoot } from 'solid-js'
import { useQuery } from '~/utils/trpc-client'

export const stockRoot = createRoot(() => {
  // fetch all products
  const [stocks, refetch, setStockLists] = useQuery('stockLists')

  return [stocks, refetch, setStockLists] as const
})
