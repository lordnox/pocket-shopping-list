import { Component, For, onMount } from 'solid-js'
import { Header, ProductWrapper } from './ProductWrapper'
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
  const [actionPending, setActionPending] = createSignal<string | undefined>('clcag1al40008le08k32pzp9x')

  onMount(() => autoAnimate(tableElement))

  return (
    <ProductContext.Provider
      value={{
        actionPending,
        cancelAction: () => setActionPending(undefined),
        isActionPending: (action: string) => actionPending() === action,
        setAction: setActionPending,
      }}
    >
      <div class="overflow-x-hidden relative shadow-md sm:rounded-lg w-full">
        <TableGrid ref={tableElement!}>
          <Header />
          <For each={props.items}>{(item) => <ProductWrapper item={item} hasActions={props.hasActions} />}</For>
        </TableGrid>
      </div>
    </ProductContext.Provider>
  )
}
