import { Component, For } from 'solid-js'
import { ProductWrapper } from './ProductWrapper'
import { CreateProduct, Product } from '~/types/product-types'
import { createSignal } from 'solid-js'
import { ProductListContext } from './ProductContext'
import styles from './styles.module.css'
import { useAutoAnimate } from '~/hooks/auto-animate'

export const ProductList: Component<{
  items: Product[]
  actionsEnabled?: boolean
  onUpdate: (data: CreateProduct) => void
}> = (props) => {
  const [actionPending, setActionPending] = createSignal<string | undefined>()

  return (
    <ProductListContext.Provider
      value={{
        actionPending,
        cancelAction: () => setActionPending(undefined),
        isActionPending: (action: string) => actionPending() === action,
        setAction: setActionPending,
      }}
    >
      <div class="relative w-full shadow-md sm:rounded-lg">
        <div class={styles.productList} ref={useAutoAnimate()}>
          <For each={props.items}>
            {(item) => <ProductWrapper item={item} hasActions={props.actionsEnabled} onUpdate={props.onUpdate} />}
          </For>
        </div>
      </div>
    </ProductListContext.Provider>
  )
}
