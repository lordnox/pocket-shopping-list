import { Component, createEffect, For, JSX, Match, onMount, splitProps, Switch } from 'solid-js'
import { useAutoAnimate } from '~/hooks/auto-animate'
import { Button } from '../inputs/Button'
import { Tag } from '../Tag'
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
  group-even/product:bg-primary-100
  group-even/product:dark:bg-primary-700
  group-odd/product:bg-primary-200
  group-odd/product:dark:bg-primary-800
  group-hover/product:bg-primary-50
  group-hover/product:dark:bg-primary-600
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

  bg-primary-700
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

const ThinProductTags = () => {
  const context = useProductContext()

  return (
    <div class="flex justify-center gap-1">
      <For each={context.product.tags}>
        {(tag) => <Tag class="bg-additional-900 px-1 text-[8px] font-normal text-primary-200">{tag.name}</Tag>}
      </For>
    </div>
  )
}

const ProductMiniHeader: Component = () => {
  const context = useProductContext()
  return (
    <div class="flex justify-end gap-1">
      <ThinProductTags />
      <AveragePrice
        class="flex items-center whitespace-nowrap text-xs"
        price={context.product.prices[0]}
        type={context.product.type}
      />
    </div>
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
    <div class="flex items-center justify-start gap-2 ">
      <InputPrice
        class="items-center font-mono text-base font-semibold text-primary-900 dark:text-white"
        price={context.product.prices[0]}
        type={context.product.type}
      />
      <ThinProductTags />
      <div>{context.product.prices[0].source?.GeoLocation?.accuracy}</div>
      <AveragePrice
        class="flex flex-1 items-center justify-end font-mono text-lg"
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
          class="flex w-full"
          onClick={() =>
            context.setState((state) => {
              if (state === 'mini') return 'midi'
              if (state === 'midi') return 'mini'
              return state
            })
          }
        >
          <h4
            class="x-transition-all flex w-full items-center truncate text-primary-900 dark:text-white"
            classList={{
              italic: context.product.optimistic,

              [miniHeadlineCss]: context.state() === 'mini',
              [midiHeadlineCss]: context.state() === 'midi',
              [maxiHeadlineCss]: context.state() === 'maxi',
            }}
          >
            {context.product.name} | {context.product.filterScore().toFixed(3)}
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
