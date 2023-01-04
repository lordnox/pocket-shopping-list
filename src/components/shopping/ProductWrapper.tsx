import { Component, createEffect, createSignal, onMount } from 'solid-js'
import { CreateProduct } from '~/types/product-types'
import { useProductDrag } from './product-drag'
import { ProductContext, ProductState, useProductListContext } from './ProductContext'
import { LeftActionContainer, RightActionContainer } from './product-actions/Container'
import { UpdateProductForm } from './UpdateProductForm'
import { StopCircle } from '../icons/stop-circle'
import { classes } from '~/utils/classes'
import buttonStyles from '~/styles/button.module.css'
import styles from './product-actions/action.module.css'
import { Product, ProductProps } from './Product'
import { longPress } from '~/utils/long-press-event'
import { vibrate } from '~/utils/vibrate'
import { useAutoAnimate } from '~/utils/auto-animate'
import { Button } from '../inputs/Button'

export const ProductWrapper: Component<{
  onUpdate: (data: CreateProduct) => void
  hasActions?: boolean
  item: ProductProps['item']
}> = (props) => {
  const context = useProductListContext()

  const [pressed, setPressed] = createSignal(false)
  const [state, setState] = createSignal<ProductState>('mini')
  const [locked, setLocked] = createSignal(false)
  const [displacement, setDisplacement] = createSignal(0)
  const [dragging, setDragging] = createSignal(false)

  const element = useProductDrag<HTMLDivElement>({
    onStart: (element) => {
      console.log('none')
      element.style.transition = 'none'
      setDragging(true)
    },
    onChange: (element, state) => {
      console.log(state.displacement)
      element.style.transform = `translate(${state.displacement}px)`
      setLocked(() => state.lockedAt !== 0)
      setDisplacement(state.displacement)
    },
    onFinished: (element, state) => {
      setDragging(false)
      if (element) element.style.transition = 'transform .2s'
      reset()
      if (state.lockedAt !== 0) context.setAction(props.item.id)
      else context.setAction('')
    },
    enabled: () => state() !== 'maxi',
  })

  const reset = () => {
    const currentElement = element()
    if (currentElement) currentElement.style.transform = ''
  }

  const isPending = () => context.actionPending() === props.item.id
  const isActive = () => locked() && isPending()
  const isLeft = () => (isPending() || dragging()) && displacement() < 0
  const isRight = () => (isPending() || dragging()) && displacement() > 0

  createEffect(() => !isActive() && reset())

  onMount(() => {
    const currentElement = element()
    longPress(
      currentElement,
      () => {
        setPressed(false)
        vibrate(250)
        setTimeout(() => setState('maxi'))
      },
      {
        // connect to capture the pressed state
        onCancel: () => setPressed(false),
        onStart: () => setPressed(true),
        // connect to disable to eventhandler when we are in maxi-mode
        enabled: () => state() !== 'maxi',
      },
    )
  })

  return (
    <>
      <ProductContext.Provider
        value={{
          setState,
          state,
        }}
      >
        <div
          class="group/product"
          classList={{
            'scale-[1.05] transition-transform duration-1000': pressed(),
            'scale-100': state() !== 'maxi' && !pressed(),
            'duration-0': isPending(),
            'relative overflow-hidden': state() !== 'maxi',
          }}
        >
          <RightActionContainer active={isActive()} locked={locked()} visible={isRight()}>
            <div class={styles.buttonContainer}>
              <div class="w-full flex justify-center">
                <button class={[buttonStyles.button, buttonStyles.deleteColors].join(' ')}>Löschen</button>
              </div>
              <Button class={classes(buttonStyles.button, buttonStyles.abortColors)} onClick={context.cancelAction}>
                <StopCircle />
              </Button>
            </div>
          </RightActionContainer>
          <LeftActionContainer active={isActive()} locked={locked()} visible={isLeft()}>
            <div class={classes(styles.updateContainer, 'gap-2')}>
              <UpdateProductForm item={props.item} onEnter={props.onUpdate} />
              <Button class={classes(buttonStyles.button, buttonStyles.abortColors)} onClick={context.cancelAction}>
                <StopCircle />
              </Button>
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
      </ProductContext.Provider>
    </>
  )
}
