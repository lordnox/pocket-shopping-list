import { Title } from 'solid-start'

import { RouterOutput, trpc, useQuery } from '~/utils/trpc-client'
import { Accessor, createEffect, createSignal, onMount, ParentComponent, Show, Signal } from 'solid-js'
import { ShoppingSearch } from '~/components/shopping/SearchFilter'
import { CreateProductForm } from '~/components/shopping/CreateProductForm'
import { ProductList } from '~/components/shopping/ProductList'
import { CreateProduct, Product, Product as ShoppingItemType } from '~/types/product-types'
import { session } from '~/utils/auth'
import { isServer } from 'solid-js/web'
import { ChevronUp } from '~/components/icons/chevron-up'
import { cacheDefined } from '~/utils/cache-signal'
import { CompareFn, updateCurrentItemList } from '~/utils/list-comparison'

const BottomElement: ParentComponent = (props) => {
  const [open, setOpen] = createSignal(false)
  return (
    <div
      class="z-20 left-0 border-t border-gray-500 bg-gray-900 fixed w-full bottom-0 transition"
      classList={{
        'opacity-70 translate-y-[calc(100%-1px)]': !open(),
        'opacity-100 translate-y-0': open(),
      }}
    >
      <div class="w-full container m-auto">
        <div class="flex justify-center relative -top-14">
          <button
            class="w-16 h-14 p-2 bg-gray-900 rounded-t-full border border-b-0 border-gray-500 text-white absolute"
            onClick={() => setOpen((open) => !open)}
          >
            <ChevronUp
              class="transition"
              classList={{
                'rotate-180': open(),
              }}
            />
          </button>
        </div>
        <div class="pb-8">{props.children}</div>
      </div>
    </div>
  )
}

const productCompare: CompareFn<Product> = (a, b) => {
  if (a.id !== b.id) return -1
  if (a.name !== b.name) return -1
  if (a.prices.length !== b.prices.length) return -1
  if (a.tags.length !== b.tags.length) return -1
  if (a.type !== b.type) return -1
  return 0
}

export default () => {
  const upsertItem = trpc.createOrUpdateProduct.mutate
  const [items, refetch, setItems] = useQuery('productList')
  const [searchKey, setSearchKey] = createSignal<string>()

  const hasActions = () => !!session()

  const cacheItems = cacheDefined('products', items)

  let lastItems: RouterOutput['productList'] | undefined = undefined
  const mergedItems = () => {
    const currentItems = cacheItems()
    if (!lastItems || !currentItems) return (lastItems = currentItems)
    return (lastItems = updateCurrentItemList(lastItems, currentItems, productCompare))
  }

  const filteredItems = () => {
    const currentItems = mergedItems() as ShoppingItemType[]
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

  const onEnter = async (createItem: CreateProduct) => {
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
            userId: data[index]?.userId ?? '',
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
      <ProductList items={sortedItems()} hasActions={hasActions()} onUpdate={onEnter} />
      <Show when={session()}>
        <BottomElement>
          <CreateProductForm onEnter={onEnter} />
        </BottomElement>
      </Show>
    </main>
  )
}
