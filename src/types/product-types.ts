import { RouterInput, RouterOutput } from '~/utils/trpc-client'

export type Product = RouterOutput['productList'][number] & {
  optimistic?: boolean
}

export type ProductPrice = RouterOutput['productList'][number]['prices'][number]
export type ProductType = RouterOutput['productList'][number]['type']

export type CreateProduct = RouterInput['createOrUpdateProduct']
