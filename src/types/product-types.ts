import { RouterInput, RouterOutput } from '~/utils/trpc-client'

export type Product = RouterOutput['productList'][number] & {
  optimistic?: boolean
}
export type CreateProduct = RouterInput['createOrUpdateProduct']
