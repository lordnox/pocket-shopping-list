import { Component, For } from 'solid-js'
import { ProductWrapper } from './ProductWrapper'
import { CreateProduct, Product as ShoppingItemType } from '~/types/product-types'
import { createSignal } from 'solid-js'
import { ProductContext } from './ProductContext'
import styles from './styles.module.css'
import { useAutoAnimate } from '~/utils/auto-animate'

export const ProductList: Component<{
  items: ShoppingItemType[]
  hasActions?: boolean
  onUpdate: (data: CreateProduct) => void
}> = (props) => {
  const [actionPending, setActionPending] = createSignal<string | undefined>('clcag1al40008le08k32pzp9x')

  return (
    <ProductContext.Provider
      value={{
        actionPending,
        cancelAction: () => setActionPending(undefined),
        isActionPending: (action: string) => actionPending() === action,
        setAction: setActionPending,
      }}
    >
      <div class="relative shadow-md sm:rounded-lg w-full">
        <div class={styles.productList} ref={useAutoAnimate()}>
          <For each={props.items}>
            {(item) => <ProductWrapper item={item} hasActions={props.hasActions} onUpdate={props.onUpdate} />}
          </For>
        </div>
      </div>
    </ProductContext.Provider>
  )
}
