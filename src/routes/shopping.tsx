import { Title } from 'solid-start'

import { trpc, useQuery } from '~/utils/trpc-client'
import { createSignal, Show } from 'solid-js'
import { ShoppingSearch } from '~/components/shopping/search'
import { ShoppingInput } from '~/components/shopping/shoppingInput'
import { ShoppingItems } from '~/components/shopping/items'
import { ShoppingItemCreate } from '~/types/shopping'
import { ShoppingItem as ShoppingItemType } from '~/types/shopping'
import { session } from '~/utils/auth'

export default () => {
  const upsertItem = trpc.createOrUpdateShoppingItem.mutate
  const [items, refetch, setItems] = useQuery('shoppingItems')
  const [searchKey, setSearchKey] = createSignal<string>()

  const filteredItems = () => {
    const currentItems = items() as ShoppingItemType[]
    const key = searchKey()?.toLowerCase()
    if (!key) return currentItems
    return currentItems.filter((item) => item.name.toLowerCase().includes(key))
  }

  const sortedItems = () => {
    const currentItems = filteredItems() as ShoppingItemType[]
    if (!currentItems) return currentItems
    currentItems.sort((a, b) => a.name.localeCompare(b.name))
    return currentItems
  }

  const onEnter = async (createItem: ShoppingItemCreate) => {
    // optimistic update:
    setItems((data) => {
      if (!data) return data
      const index = data.findIndex((entry) => entry.name === createItem.name)
      const newItem: ShoppingItemType = {
        ...data[index],
        optimistic: true,
        type: createItem.type,
        name: createItem.name,
        prices: [
          {
            amount: createItem.amount,
            id: '',
            createdAt: '',
            itemId: '',

            price: createItem.price,
            locationId: null,
            normalizedPrice: (createItem.price / createItem.amount) * 1000,
          },
          ...(data[index]?.prices ?? []),
        ],
      }

      return index !== -1 ? [...data.slice(0, index), newItem, ...data.slice(index + 1)] : [...data, newItem]
    })
    await upsertItem(createItem)
    await refetch()
  }

  return (
    <main class="container text-center mx-auto text-gray-700 p-4">
      <Title>Shopping</Title>
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase mt-4 mb-8">Shopping</h1>
      <ShoppingSearch debounce={50} label="Filter" placeholder="Name" buttonText="Filter" onSearch={setSearchKey} />
      <Show when={session()}>
        <ShoppingInput onEnter={onEnter} />
      </Show>
      <ShoppingItems items={sortedItems()} />
    </main>
  )
}
