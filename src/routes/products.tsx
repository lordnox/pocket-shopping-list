import { trpc } from '~/utils/trpc-client'
import { createMemo, createSignal, Show } from 'solid-js'
import { ShoppingSearch } from '~/components/product/SearchFilter'
import { CreateProductForm } from '~/components/product/CreateProductForm'
import { ProductList } from '~/components/product/ProductList'
import { CreateProduct, Product, productCompare, updateProduct } from '~/types/product-types'
import { isAuthenticated, session } from '~/utils/auth'
import { cacheDefined, compareCache, createFilter, createSorter } from '~/utils/signal-functions'
import { H1WithTitle, Main } from '~/components/Basics'
import { geolocation } from '~/utils/geolocation'
import { Accessor } from 'solid-js'
import { DragUpElement } from '~/components/navigation/DragUpElement'
import { productsRoot } from '~/components/roots/products'

import { WrappedProduct } from '~/components/product/ProductContext'
import { distance } from 'fastest-levenshtein'

type Scorer<Type = string> = (value: Type) => number

const stringScorer = (search: string): Scorer => {
  const existsInOrder = new RegExp(search, 'i')
  const startsWith = new RegExp('^' + search, 'i')
  const equalsTo = new RegExp('^' + search + '$', 'i')
  const scorer: Scorer = (value) => {
    if (equalsTo.test(value)) return 1
    if (startsWith.test(value)) return search.length / value.length
    if (existsInOrder.test(value)) return search.length / value.length
    if (value.length < search.length) return 0
    return 1 - distance(search, value) / value.length
  }
  scorer.toString = () => `stringScorer('${search}')`
  return scorer
}

const multiScorer =
  <Type,>(...scorers: Scorer<Type>[]): Scorer<Type> =>
  (value) =>
    scorers.reduce((current, scorer) => current + scorer(value), 0)

const scoreProduct = (search: string | undefined): Scorer<WrappedProduct> => {
  const scorer = !!search && multiScorer(...search.split(' ').map(stringScorer))
  return (product) => {
    if (!scorer) return 1
    const nameScore = scorer(product.name)
    const tagScore = product.tags.reduce((memo, tag) => Math.min(memo, scorer(tag.name)), Infinity)
    const score = tagScore !== Infinity ? nameScore + tagScore : nameScore
    return score
  }
}
export default () => {
  const upsertItem = trpc.createOrUpdateProduct.mutate
  const [searchKey, setSearchKey] = createSignal<string>()
  // fetch all products
  const [products, refetch, setProducts] = productsRoot
  // put the products into storage
  const storageCachedProducts = cacheDefined('products', products as Accessor<Product[]>)
  // create a list compare cache, only update the parts of the list that change
  const comparedItems = compareCache(storageCachedProducts, productCompare)

  const enhancedProducts = createMemo(() =>
    comparedItems()
      // .slice(0, 0)
      .map((product) => {
        const [filterScore, setFilterScore] = createSignal(1)
        return {
          ...product,
          filterScore,
          setFilterScore,
        }
      }),
  )

  const scorer = createMemo(() => scoreProduct(searchKey()))

  const sortFn = (a: WrappedProduct, b: WrappedProduct) => {
    const score = b.filterScore() - a.filterScore()
    if (!score) return a.name.localeCompare(b.name)
    return score
  }

  const sortedItems = createMemo(() => {
    const productScorer = scorer()
    const products = enhancedProducts()
    products.forEach((product) => product.setFilterScore(productScorer(product)))
    const currentItems = products.filter((product) => product.filterScore() > 0)
    currentItems.sort(sortFn)
    return currentItems
  })

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
      <H1WithTitle>Produkte</H1WithTitle>
      <ShoppingSearch debounce={50} label="Filter" placeholder="Name" buttonText="Filter" onSearch={setSearchKey} />
      <ProductList products={sortedItems()} actionsEnabled={isAuthenticated()} onUpdate={onEnter} />
      <Show when={session()}>
        <DragUpElement>
          <CreateProductForm onEnter={onEnter} />
        </DragUpElement>
      </Show>
    </Main>
  )
}
