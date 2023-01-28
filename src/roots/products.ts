import { createRoot } from 'solid-js'
import { useQuery } from '~/utils/trpc-client'

export const productsRoot = createRoot(() => {
  // fetch all products
  const [products, refetch, setProducts] = useQuery('productList')

  return [products, refetch, setProducts] as const
})
