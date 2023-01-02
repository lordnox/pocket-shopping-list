import { Title } from 'solid-start'

import { trpc, useQuery } from '~/utils/trpc-client'
import { Accessor, createEffect, createSignal, onMount, ParentComponent, Show, Signal } from 'solid-js'
import { ShoppingSearch } from '~/components/shopping/SearchFilter'
import { CreateProductForm } from '~/components/shopping/CreateProductForm'
import { ProductList } from '~/components/shopping/ProductList'
import { CreateProduct, Product as ShoppingItemType } from '~/types/product-types'
import { session } from '~/utils/auth'
import { isServer } from 'solid-js/web'
import { ChevronUp } from '~/components/icons/chevron-up'

const readStorage = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '')
  } catch (e) {
    return undefined
  }
}

const writeStorage = (key: string, value: any) => {
  try {
    return localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    return undefined
  }
}

const cacheDefined = <Type,>(key: string, getter: Accessor<Type>): Accessor<Type> => {
  if (isServer) return getter
  const [cache, setCache] = createSignal<Type>(getter())
  onMount(() => setCache(readStorage(key)))
  createEffect(() => {
    const data = getter()
    // ignore caching undefined values
    if (typeof data === 'undefined') return
    setCache(() => data)
    writeStorage(key, data)
  })
  return cache
}

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

export default () => {
  const upsertItem = trpc.createOrUpdateProduct.mutate
  const [items, refetch, setItems] = useQuery('productList')
  const [searchKey, setSearchKey] = createSignal<string>()

  const hasActions = () => !!session()

  const cacheItems = cacheDefined('products', items)
  const filteredItems = () => {
    const currentItems = cacheItems() as ShoppingItemType[]
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
      <ProductList
        items={sortedItems()}
        hasActions={hasActions()}
        onUpdate={(data) => {
          console.log('index', data)
        }}
      />
      <Show when={session()}>
        <BottomElement>
          <CreateProductForm onEnter={onEnter} />
        </BottomElement>
      </Show>
    </main>
  )
}
