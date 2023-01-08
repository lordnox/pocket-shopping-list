import { trpc, useQuery } from '~/utils/trpc-client'
import { createSignal, ParentComponent, Show } from 'solid-js'
import { ShoppingSearch } from '~/components/product/SearchFilter'
import { CreateProductForm } from '~/components/product/CreateProductForm'
import { ProductList } from '~/components/product/ProductList'
import { CreateProduct, Product, productCompare } from '~/types/product-types'
import { isAuthenticated, session } from '~/utils/auth'
import { ChevronUp } from '~/components/icons/chevron-up'
import { cacheDefined, compareCache, createFilter, createSorter } from '~/utils/signal-functions'
import { CompareFn, updateCurrentItemList } from '~/utils/list-comparison'
import { useDrag } from '~/utils/use-drag'
import { H1, Main } from '~/components/Basics'
import { geolocation } from '~/utils/geolocation'
import { Accessor } from 'solid-js'

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
    onStart: () => {
      setDragging(true)
    },
    onChange(_, state) {
      const [displacement, rotate] = calculateDisplacement(state.displacement)
      containerElement.style.transform = `translateY(${displacement}px)`
      svgElement.style.transform = `rotate(${180 - rotate * 180}deg)`
    },
    onFinished(_, state) {
      setDragging(false)
      console.log('onFinished', state)
      containerElement.style.transform = ''
      svgElement.style.transform = ''
      state.lockedAt && setOpen((open) => !open)
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
        'opacity-70 translate-y-[calc(100%-1px)]': !dragging() && !open(),
        'opacity-100 translate-y-0': dragging() || open(),
      }}
    >
      <div class="container m-auto w-full">
        <div class="relative -top-14 flex justify-center" ref={dragElement}>
          <button
            class="absolute h-14 w-16 touch-none rounded-t-full border border-b-0 border-gray-500 bg-gray-900 p-2 text-white"
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

export default () => {
  const upsertItem = trpc.createOrUpdateProduct.mutate
  const [searchKey, setSearchKey] = createSignal<string>()
  // fetch all products
  const [products, refetch, setProducts] = useQuery('productList')
  // put the products into storage
  const storageCachedProducts = cacheDefined('products', products as Accessor<Product[]>)
  // create a list compare cache, only update the parts of the list that change
  const comparedItems = compareCache(storageCachedProducts, productCompare)
  // activate client based filtering
  const key = () => searchKey()?.toLowerCase()
  const filteredItems = createFilter(comparedItems, (item) => (key() ? item.name.toLowerCase().includes(key()!) : true))
  // sort items
  const sortedItems = createSorter(filteredItems, (a, b) => a.name.localeCompare(b.name))

  const onEnter = async (createItem: CreateProduct) => {
    // optimistic update:
    setProducts((data) => {
      if (!data) return data
      const index = data.findIndex((entry) => entry.name === createItem.name)
      const newItem: Product = {
        ...data[index],
        optimistic: true,
        type: createItem.type,
        name: createItem.name,
        prices: [
          {
            amount: createItem.amount,
            price: createItem.price,
            source: null,
            normalizedPrice: (createItem.price / createItem.amount) * 1000,
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

    const location = await geolocation.location(false)
    const source = location?.coords
      ? {
          location: {
            accuracy: location.coords.accuracy,
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        }
      : undefined

    await upsertItem({ ...createItem, source })
    await refetch()
  }

  return (
    <Main>
      <H1>Shopping</H1>
      <ShoppingSearch debounce={50} label="Filter" placeholder="Name" buttonText="Filter" onSearch={setSearchKey} />
      <ProductList items={sortedItems()} actionsEnabled={isAuthenticated()} onUpdate={onEnter} />
      <Show when={session()}>
        <BottomElement>
          <CreateProductForm onEnter={onEnter} />
        </BottomElement>
      </Show>
    </Main>
  )
}
