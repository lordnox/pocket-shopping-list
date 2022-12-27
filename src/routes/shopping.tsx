import { Title } from 'solid-start'

import { trpc, useQuery } from '~/utils/trpc-client'
import { createSignal } from 'solid-js'
import { ShoppingSearch } from '~/components/shopping/search'
import { ShoppingInput } from '~/components/shopping/input'
import { ShoppingItems } from '~/components/shopping/items'
import { ShoppingItemCreate } from '~/types/shopping'
import { ShoppingItem as ShoppingItemType } from '~/types/shopping'

export default () => {
  const upsertItem = trpc.createOrUpdateShoppingItem.mutate
  const [items, refetch] = useQuery('shoppingItems')
  const [searchKey, setSearchKey] = createSignal<string>()

  const filteredItems = () => {
    const currentItems = items() as ShoppingItemType[]
    const key = searchKey()?.toLowerCase()
    if (!key) return currentItems
    return currentItems.filter((item) => item.name.toLowerCase().includes(key))
  }

  const onEnter = async (data: ShoppingItemCreate) => {
    await upsertItem(data)
    await refetch()
  }

  return (
    <main class="container text-center mx-auto text-gray-700 p-4">
      <Title>Shopping</Title>
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase mt-4 mb-8">Shopping</h1>
      <ShoppingSearch debounce={50} label="Filter" placeholder="Name" buttonText="Filter" onSearch={setSearchKey} />
      <ShoppingInput onEnter={onEnter} />
      <ShoppingItems items={filteredItems()} />
    </main>
  )
}
