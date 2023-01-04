import { ItemType } from '@prisma/client'
import { RouterInput, RouterOutput } from '~/utils/trpc-client'

export type Product = RouterOutput['productList'][number] & {
  optimistic?: boolean
}

export type ProductPrice = RouterOutput['productList'][number]['prices'][number]
export type ProductType = ItemType

export type CreateProduct = RouterInput['createOrUpdateProduct']
