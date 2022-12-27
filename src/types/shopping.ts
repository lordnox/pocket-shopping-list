import { RouterInput, RouterOutput } from '~/utils/trpc-client'

export type ShoppingItem = RouterOutput['shoppingItems'][number]
export type ShoppingItemCreate = RouterInput['createOrUpdateShoppingItem']
