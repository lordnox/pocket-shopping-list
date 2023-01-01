import { Component, createEffect } from 'solid-js'
import { Product as ShoppingItemType } from '~/types/product-types'
import { useProductDrag } from './product-drag'
import { useProductContext } from './ProductContext'
import { RightActionContainer } from './product-actions/Right-Actions'
import { LeftActionContainer } from './product-actions/Left-Actions'
import { UpdateProductForm } from './UpdateProductForm'
import { StopCircle } from '../icons/stop-circle'
import { classes } from '~/utils/classes'
import buttonStyles from '~/styles/button.module.css'
import styles from './product-actions/action.module.css'
import { Product } from './Product'

const rowClass = `
  relative
  transition-color
  grid
  grid-cols-[1fr_100px_150px]
  w-full
  group-last:rounded-b-lg
`

const itemRowCss = `
  ${rowClass}  
  z-20
  border-b
  group-even:bg-gray-100
  group-even:dark:bg-gray-700
  group-odd:dark:bg-gray-800
  dark:border-gray-700
  group-hover:bg-gray-50
  group-hover:dark:bg-gray-600
  touch-pan-y
`

interface ProductProps {
  item: ShoppingItemType
  hasActions?: boolean
}

export const ProductWrapper: Component<ProductProps> = (props) => {
  let element: HTMLDivElement

  const context = useProductContext()

  const reset = () => (element.style.transform = '')

  const [direction, locked] = useProductDrag(() => element, {
    onFinished: (element, state) => {
      element.style.transition = 'transform .2s'
      reset()
      if (state.locked) context.setAction(props.item.id)
    },
  })

  const isActive = () => locked() && context.actionPending() === props.item.id
  const isLeft = () => direction() < 0
  const isRight = () => direction() > 0

  createEffect(() => !isActive() && reset())

  return (
    <div class="group relative">
      <RightActionContainer active={isActive()} locked={locked()} visible={isRight()}>
        <div class={styles.buttonContainer}>
          <div class="w-full flex justify-center">
            <button class={[buttonStyles.button, buttonStyles.deleteColors].join(' ')}>Löschen</button>
          </div>
          <button class={classes(buttonStyles.button, buttonStyles.abortColors)} onClick={context.cancelAction}>
            <StopCircle />
          </button>
        </div>
      </RightActionContainer>
      <LeftActionContainer active={isActive()} locked={locked()} visible={isLeft()}>
        <div class={classes(styles.updateContainer, 'gap-2')}>
          <UpdateProductForm item={props.item} onEnter={(data) => console.log(data)} />
          <button class={classes(buttonStyles.button, buttonStyles.abortColors)} onClick={context.cancelAction}>
            <StopCircle />
          </button>
        </div>
      </LeftActionContainer>

      <div
        ref={element!}
        class={itemRowCss}
        classList={{
          'translate-x-full': isRight() && isActive(),
          '-translate-x-full': isLeft() && isActive(),
        }}
      >
        <Product item={props.item} />
      </div>
    </div>
  )
}
