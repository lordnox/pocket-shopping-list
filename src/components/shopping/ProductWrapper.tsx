import { Component, createEffect, createSignal, onMount } from 'solid-js'
import { CreateProduct } from '~/types/product-types'
import { useDrag } from '../../utils/use-drag'
import { ProductContext, ProductState, useProductListContext } from './ProductContext'
import { LeftActionContainer, RightActionContainer } from './product-actions/Container'
import { UpdateProductForm } from './UpdateProductForm'
import { StopCircle } from '../icons/stop-circle'
import { classes } from '~/utils/classes'
import buttonStyles from '~/styles/button.module.css'
import styles from './product-actions/action.module.css'
import { Product as ProductType } from '~/types/product-types'
import { Product } from './Product'
import { longPress } from '~/utils/long-press-event'
import { vibrate } from '~/utils/vibrate'
import { Button } from '../inputs/Button'

export const ProductWrapper: Component<{
  onUpdate: (data: CreateProduct) => void
  hasActions?: boolean
  item: ProductType
}> = (props) => {
  const context = useProductListContext()

  const [pressed, setPressed] = createSignal(false)
  const [state, setState] = createSignal<ProductState>('mini')
  const [locked, setLocked] = createSignal(false)
  const [displacement, setDisplacement] = createSignal(0)
  const [dragging, setDragging] = createSignal(false)

  const element = useDrag<HTMLDivElement>({
    onStart: (element) => {
      element.style.transition = 'none'
      setDragging(true)
    },
    onLocked: () => vibrate(250),
    onChange: (element, state) => {
      element.style.transform = `translate(${state.displacement}px)`
      setLocked(() => state.lockedAt !== 0)
      setDisplacement(state.displacement)
    },
    onFinished: (element, state) => {
      setDragging(false)
      if (element) element.style.transition = 'transform .2s'
      reset()

      context.setAction((action) => {
        if (state.lockedAt !== 0) return props.item.id
        if (action === props.item.id) return ''
        return action
      })
    },
    enabled: () => state() !== 'maxi',
    config: {
      axis: 'x',
    },
  })

  const reset = () => {
    const currentElement = element()
    if (currentElement) currentElement.style.transform = ''
  }

  const isPending = () => context.isActionPending(props.item.id)
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
          product: props.item,
        }}
      >
        <div
          class="group/product"
          classList={{
            'scale-[1.05] transition-transform duration-1000': pressed(),
            'scale-100': state() !== 'maxi' && !pressed(),
            'duration-0': isPending(),
            'relative overflow-hidden': state() !== 'maxi',
            'min-h-[50px]': isActive(),
          }}
        >
          <RightActionContainer active={isActive()} locked={locked()} visible={isRight()}>
            <div class={styles.buttonContainer}>
              <div class="flex w-full justify-center">
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
          />
        </div>
      </ProductContext.Provider>
    </>
  )
}
