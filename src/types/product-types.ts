import { ItemType } from '@prisma/client'
import { CompareFn } from '~/utils/list-comparison'
import { RouterInput, RouterOutput } from '~/utils/trpc-client'

export type Product = RouterOutput['productList'][number] & {
  optimistic?: boolean
}

export type ProductPrice = RouterOutput['productList'][number]['prices'][number]
export type ProductType = ItemType

export type CreateProduct = RouterInput['createOrUpdateProduct']

export const productCompare: CompareFn<Product> = (a, b) => {
  if (a.id !== b.id) return -1
  if (a.name !== b.name) return -1
  if (a.prices.length !== b.prices.length) return -1
  if (a.tags.length !== b.tags.length) return -1
  if (a.type !== b.type) return -1
  return 0
}

export const updateProduct = (product: Product, changes: CreateProduct): Product => ({
  ...product,
  optimistic: true,
  type: changes.type,
  name: changes.name,
  prices: [
    {
      amount: changes.amount,
      price: changes.price,
      source: null,
      normalizedPrice: (changes.price / changes.amount) * 1000,
    },
    ...(product?.prices ?? []),
  ],
  tags: changes.tags.map((tag) => ({
    id: '',
    name: tag,
  })),
})
