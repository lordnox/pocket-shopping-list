import { Component, For, onMount } from 'solid-js'
import { Header, Product } from './Product'
import { Product as ShoppingItemType } from '~/types/product-types'
import autoAnimate from '@formkit/auto-animate'
import { createDiv } from '~/utils/createTag'
import { createSignal } from 'solid-js'
import { ProductContext } from './ProductContext'

const TableGrid = createDiv(`
  flex
  flex-col
  w-full
  text-sm
  text-left
  text-gray-500
  dark:text-gray-400
`)

export const ProductList: Component<{
  items: ShoppingItemType[]
  hasActions?: boolean
}> = (props) => {
  let tableElement: HTMLTableElement
  const [actionPending, setActionPending] = createSignal<string>()

  onMount(() => autoAnimate(tableElement))

  return (
    <ProductContext.Provider value={{ actionPending }}>
      <div class="overflow-x-hidden relative shadow-md sm:rounded-lg w-full">
        <TableGrid ref={tableElement!}>
          <Header />
          <For each={props.items}>
            {(item) => (
              <Product
                item={item}
                hasActions={props.hasActions}
                onActionPending={(pending) => setActionPending(pending)}
              />
            )}
          </For>
        </TableGrid>
      </div>
    </ProductContext.Provider>
  )
}
