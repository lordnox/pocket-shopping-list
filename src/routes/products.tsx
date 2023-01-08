import { trpc, useQuery } from '~/utils/trpc-client'
import { createSignal, Show } from 'solid-js'
import { ShoppingSearch } from '~/components/product/SearchFilter'
import { CreateProductForm } from '~/components/product/CreateProductForm'
import { ProductList } from '~/components/product/ProductList'
import { CreateProduct, Product, productCompare, updateProduct } from '~/types/product-types'
import { isAuthenticated, session } from '~/utils/auth'
import { cacheDefined, compareCache, createFilter, createSorter } from '~/utils/signal-functions'
import { H1, Main } from '~/components/Basics'
import { geolocation } from '~/utils/geolocation'
import { Accessor } from 'solid-js'
import { DragUpElement } from '~/components/navigation/DragUpElement'
import { productsRoot } from '~/components/roots/products'

export default () => {
  const upsertItem = trpc.createOrUpdateProduct.mutate
  const [searchKey, setSearchKey] = createSignal<string>()
  // fetch all products
  const [products, refetch, setProducts] = productsRoot
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
      const newItem = updateProduct(data[index], createItem)
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
      <H1>Produkte</H1>
      <ShoppingSearch debounce={50} label="Filter" placeholder="Name" buttonText="Filter" onSearch={setSearchKey} />
      <ProductList items={sortedItems()} actionsEnabled={isAuthenticated()} onUpdate={onEnter} />
      <Show when={session()}>
        <DragUpElement>
          <CreateProductForm onEnter={onEnter} />
        </DragUpElement>
      </Show>
    </Main>
  )
}
