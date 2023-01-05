import { Title } from 'solid-start'

import { RouterOutput, trpc, useQuery } from '~/utils/trpc-client'
import { createSignal, ParentComponent, Show } from 'solid-js'
import { ShoppingSearch } from '~/components/shopping/SearchFilter'
import { CreateProductForm } from '~/components/shopping/CreateProductForm'
import { ProductList } from '~/components/shopping/ProductList'
import { CreateProduct, Product, Product as ShoppingItemType } from '~/types/product-types'
import { session } from '~/utils/auth'
import { ChevronUp } from '~/components/icons/chevron-up'
import { cacheDefined } from '~/utils/cache-signal'
import { CompareFn, updateCurrentItemList } from '~/utils/list-comparison'
import { useDrag } from '~/utils/use-drag'
import { H1, Main } from '~/components/Basics'

const BottomElement: ParentComponent = (props) => {
  let containerElement: HTMLDivElement
  let svgElement: SVGSVGElement

  const [open, setOpen] = createSignal(false)
  const [dragging, setDragging] = createSignal(false)

  const calculateDisplacement = (value: number) => {
    const height = containerElement.getBoundingClientRect().height
    const displacement = open()
      ? Math.max(0, Math.min(value, height))
      : Math.min(height, Math.max(value + height - 1, 0))
    return [displacement, displacement / height] as const
  }

  const dragElement = useDrag({
    onStart: (element, state) => {
      setDragging(true)
      console.log('onStart')
    },
    onChange(element, state) {
      const [displacement, rotate] = calculateDisplacement(state.displacement)
      containerElement.style.transform = `translateY(${displacement}px)`
      svgElement.style.transform = `rotate(${180 - rotate * 180}deg)`
    },
    onFinished(element, state) {
      setDragging(false)
      console.log('onFinished', state)
      containerElement.style.transform = ''
      svgElement.style.transform = ''
      state.lockedAt && setOpen((open) => !open)
    },
    onLocked(element, state) {
      console.log('onLocked')
    },
    onUnlocked(element, state) {
      console.log('onUnlocked')
    },
    config: {
      axis: 'y',
      factors: {
        lockInFactor: 0.5,
        lockInMin: 10,
        lockInMax: 1000,
        lockOffFactor: 0.5,
        lockOffMin: 10,
        lockOffMax: 1000,
      },
    },
    getElementMaxDistance: () => containerElement.getBoundingClientRect().height,
  })

  return (
    <div
      ref={containerElement!}
      class="fixed left-0 bottom-0 z-20 w-full border-t border-gray-500 bg-gray-900"
      classList={{
        transition: !dragging(),
        'opacity-70 translate-y-[calc(100%-1px)]': !open(),
        'opacity-100 translate-y-0': open(),
      }}
    >
      <div class="container m-auto w-full">
        <div class="relative -top-14 flex justify-center" ref={dragElement}>
          <button
            class="absolute  h-14 w-16 touch-none rounded-t-full border border-b-0 border-gray-500 bg-gray-900 p-2 text-white"
            onClick={() => !dragging() && setOpen((open) => !open)}
          >
            <ChevronUp
              ref={svgElement!}
              class="pointer-events-none"
              classList={{
                transition: !dragging(),
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
        tags: createItem.tags.map((tag) => ({
          id: '',
          name: tag,
        })),
      }

      return index !== -1 ? [...data.slice(0, index), newItem, ...data.slice(index + 1)] : [...data, newItem]
    })
    await upsertItem(createItem)
    await refetch()
  }

  return (
    <Main>
      <H1>Shopping</H1>
      <ShoppingSearch debounce={50} label="Filter" placeholder="Name" buttonText="Filter" onSearch={setSearchKey} />
      <ProductList items={sortedItems()} hasActions={hasActions()} onUpdate={onEnter} />
      <Show when={session()}>
        <BottomElement>
          <CreateProductForm onEnter={onEnter} />
        </BottomElement>
      </Show>
    </Main>
  )
}
