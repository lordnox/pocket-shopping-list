import { RouterInput, RouterOutput } from '~/utils/trpc-client'

export type ShoppingItem = RouterOutput['shoppingItems'][number] & {
  optimistic?: boolean
}
export type ShoppingItemCreate = RouterInput['createOrUpdateShoppingItem']
