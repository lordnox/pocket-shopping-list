import { Component, createEffect, JSX, Match, onMount, splitProps, Switch } from 'solid-js'
import { useAutoAnimate } from '~/utils/auto-animate'
import { Button } from '../inputs/Button'
import { AveragePrice, InputPrice } from './Price'
import { ProductState, useProductContext } from './ProductContext'

export interface ProductProps {
  ref: (element: HTMLDivElement) => void
}

const miniMidiContainer = `
  relative
  transition        
  w-full
  rounded-lg
  z-20
  touch-pan-y
`
const miniMidiColors = `
  group-even/product:bg-gray-100
  group-even/product:dark:bg-gray-700
  group-odd/product:bg-gray-200
  group-odd/product:dark:bg-gray-800
  group-hover/product:bg-gray-50
  group-hover/product:dark:bg-gray-600
`
const miniContainer = `
  ${miniMidiContainer}
  ${miniMidiColors}
  p-1
  flex justify-between
`
const midiContainer = `
  ${miniMidiContainer}
  ${miniMidiColors}
  p-2
  flex-col
`
const maxiContainer = `
  fixed
  z-50 
  left-0
  top-[80px]
  w-[calc(100vw-1rem)]
  h-[calc(100vh-80px-1rem)]  
  rounded-lg
  m-2
  p-4

  bg-gray-700
`

const miniHeadlineCss = `
  text-xs
`
const midiHeadlineCss = `
  text-md
  font-bold
`
const maxiHeadlineCss = `
  text-lg 
  font-bold
`

const ProductMiniHeader: Component = () => {
  const context = useProductContext()
  return (
    <AveragePrice class="whitespace-nowrap text-xs" price={context.product.prices[0]} type={context.product.type} />
  )
}

const ProductMidiHeader: Component = () => {
  const context = useProductContext()
  return <Button onClick={() => context.setState('maxi')}>Max</Button>
}

const ProductMaxiHeader: Component = () => {
  const context = useProductContext()
  return <Button onClick={() => context.setState('mini')}>X</Button>
}

const ProductMidiContent: Component = () => {
  const context = useProductContext()
  return (
    <div class="flex justify-between">
      <InputPrice
        class="font-mono items-center text-base font-semibold text-gray-900 dark:text-white"
        price={context.product.prices[0]}
        type={context.product.type}
      />
      <AveragePrice
        class="text-lg font-mono place-self-end"
        price={context.product.prices[0]}
        type={context.product.type}
      />
    </div>
  )
}

export const Product: Component<ProductProps & Omit<JSX.HTMLAttributes<HTMLDivElement>, 'ref'>> = (props) => {
  const [, divProps] = splitProps(props, ['ref'])
  const context = useProductContext()
  const autoAnimate = useAutoAnimate()
  let element: HTMLDivElement
  let shadow: HTMLDivElement

  let lastState: ProductState = context.state()
  let boundingState: DOMRect

  onMount(() => {
    boundingState = element.getBoundingClientRect()
  })

  createEffect(() => {
    if (!element) return

    const state = context.state()
    if (lastState !== state) {
      switch (state) {
        case 'maxi': {
          const { width, height } = boundingState

          shadow.style.width = `${width}px`
          shadow.style.height = `${height}px`
          shadow.style.display = 'block'
          break
        }
        default:
          boundingState = element.getBoundingClientRect()

          shadow.style.width = `0px`
          shadow.style.height = `0px`
          shadow.style.display = 'none'
      }
      lastState = state
    }
  })

  return (
    <>
      <div
        ref={(elementRef) => {
          element = elementRef
          autoAnimate(elementRef)
          props.ref(elementRef)
        }}
        {...divProps}
        classList={{
          [miniContainer]: context.state() === 'mini',
          [midiContainer]: context.state() === 'midi',
          [maxiContainer]: context.state() === 'maxi',
          ...props.classList,
        }}
      >
        <header
          class="w-full flex"
          onClick={() =>
            context.setState((state) => {
              if (state === 'mini') return 'midi'
              if (state === 'midi') return 'mini'
              return state
            })
          }
        >
          <h4
            class="w-full truncate text-gray-900 dark:text-white"
            classList={{
              italic: context.product.optimistic,

              [miniHeadlineCss]: context.state() === 'mini',
              [midiHeadlineCss]: context.state() === 'midi',
              [maxiHeadlineCss]: context.state() === 'maxi',
            }}
          >
            {context.product.name}
          </h4>
          <Switch>
            <Match when={context.state() === 'mini'}>
              <ProductMiniHeader />
            </Match>
            <Match when={context.state() === 'midi'}>
              <ProductMidiHeader />
            </Match>
            <Match when={context.state() === 'maxi'}>
              <ProductMaxiHeader />
            </Match>
          </Switch>
        </header>
        <Switch>
          <Match when={context.state() === 'midi'}>
            <ProductMidiContent />
          </Match>
        </Switch>
      </div>
      <div ref={shadow!}></div>
    </>
  )
}
