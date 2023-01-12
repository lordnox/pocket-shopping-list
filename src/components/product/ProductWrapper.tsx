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
import { Product } from './Product'
import { longPress } from '~/utils/long-press-event'
import { vibrate } from '~/utils/vibrate'
import { Button } from '../inputs/Button'
import { TagsProductForm } from './TagsProductForm'

export interface ProductWrapperProps {
  onUpdate: (data: CreateProduct) => void
  hasActions?: boolean
  product: ProductContext['product']
}

export const ProductWrapper: Component<ProductWrapperProps> = (props) => {
  const context = useProductListContext()

  const [pressed, setPressed] = createSignal(false)
  const [state, setState] = createSignal<ProductState>('mini')
  const [locked, setLocked] = createSignal(false)
  const [displacement, setDisplacement] = createSignal(0)
  const [dragging, setDragging] = createSignal(false)

  const reset = (element: HTMLDivElement) => {
    if (element) element.style.transform = ''
  }

  const cleanupDrag = (element: HTMLDivElement) => {
    setDragging(false)
    if (element) element.style.transition = 'transform .2s'
    reset(element)
  }
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
    onCancel: cleanupDrag,
    onFinished: (element, state) => {
      cleanupDrag(element)
      context.setAction((action) => {
        if (state.lockedAt !== 0) return props.product.id
        if (action === props.product.id) return ''
        return action
      })
    },
    enabled: () => state() !== 'maxi',
    config: {
      axis: 'x',
    },
  })

  const isPending = () => context.isActionPending(props.product.id)
  const isActive = () => locked() && isPending()
  const isLeft = () => (isPending() || dragging()) && displacement() < 0
  const isRight = () => (isPending() || dragging()) && displacement() > 0

  // reset when this product is not active anymore, exept when we are currently dragging
  createEffect(() => !dragging() && !isActive() && reset(element()))

  onMount(() => {
    const currentElement = element()
    longPress(
      currentElement,
      () => {
        cleanupDrag(element())
        setPressed(false)
        vibrate(250)
        setTimeout(() => setState('maxi'))
      },
      {
        timeout: 450,
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
          activeAnimation: () => !dragging(),
          setState,
          state,
          product: props.product,
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
          <RightActionContainer
            active={isActive()}
            locked={locked()}
            visible={isRight()}
            fallback={<label>Tags</label>}
          >
            <div class={classes(styles.updateContainer, 'gap-2')}>
              <TagsProductForm item={props.product} onEnter={props.onUpdate} />
              <Button class={classes(buttonStyles.button, buttonStyles.abortColors)} onClick={context.cancelAction}>
                <StopCircle />
              </Button>
            </div>
          </RightActionContainer>
          <LeftActionContainer
            active={isActive()}
            locked={locked()}
            visible={isLeft()}
            fallback={<label>Update</label>}
          >
            <div class={classes(styles.updateContainer, 'gap-2')}>
              <UpdateProductForm item={props.product} onEnter={props.onUpdate} />
              <Button class={classes(buttonStyles.button, buttonStyles.abortColors)} onClick={context.cancelAction}>
                <StopCircle />
              </Button>
            </div>
          </LeftActionContainer>

          <Product
            ref={element}
            classList={{
              'translate-x-full': !dragging() && isRight() && isActive(),
              '-translate-x-full': !dragging() && isLeft() && isActive(),
            }}
          />
        </div>
      </ProductContext.Provider>
    </>
  )
}
