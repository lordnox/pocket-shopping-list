import { Component, createEffect, createSignal, onMount } from 'solid-js'
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
import { longPress } from '~/utils/long-press-event'
import { vibrate } from '~/utils/vibrate'

interface ProductProps {
  item: ShoppingItemType
  hasActions?: boolean
}

export const ProductWrapper: Component<ProductProps> = (props) => {
  const context = useProductContext()

  const [pressed, setPressed] = createSignal(false)
  const [active, setActive] = createSignal(false)

  const [element, direction, locked] = useProductDrag<HTMLDivElement>({
    onFinished: (element, state) => {
      if (element) element.style.transition = 'transform .2s'
      reset()
      if (state.locked) context.setAction(props.item.id)
    },
  })

  const reset = () => {
    const currentElement = element()
    if (currentElement) currentElement.style.transform = ''
  }

  const isActive = () => locked() && context.actionPending() === props.item.id
  const isLeft = () => direction() < 0
  const isRight = () => direction() > 0

  createEffect(() => !isActive() && reset())

  onMount(() => {
    const currentElement = element()
    longPress(
      currentElement,
      () => {
        setPressed(false)
        vibrate(250)
        setActive(true)
      },
      {
        onCancel: () => setPressed(false),
        onStart: () => setPressed(true),
      },
    )
  })

  return (
    <div
      class="group/product relative transition-transform duration-1000"
      classList={{
        'scale-[1.05]': pressed(),
        'scale-100': !pressed(),
      }}
    >
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

      <Product
        ref={element}
        classList={{
          'translate-x-full': isRight() && isActive(),
          '-translate-x-full': isLeft() && isActive(),
        }}
        item={props.item}
      />
    </div>
  )
}
