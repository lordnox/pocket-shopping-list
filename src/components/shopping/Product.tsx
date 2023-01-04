import autoAnimate from '@formkit/auto-animate'
import { ItemType } from '@prisma/client'
import { Component, createRenderEffect, JSX, Match, onMount, Ref, Setter, Show, splitProps, Switch } from 'solid-js'
import { Product as ShoppingItemType } from '~/types/product-types'
import { useAutoAnimate } from '~/utils/auto-animate'
import { classes } from '~/utils/classes'
import { Button } from '../inputs/Button'
import { amountTypes } from './amount'
import { ProductState, useProductContext, useProductListContext } from './ProductContext'

const selectUnit = (amount: number) => (amount >= 1000 ? 1 : 0)

const amountString = (amount: number, type: ItemType) => {
  const unit = selectUnit(amount)
  const number = unit ? (amount / 1000).toFixed(1) : amount.toString()
  return `${number} ${amountTypes[type].unit[unit]}`
}

export interface ProductProps {
  item: ShoppingItemType
  ref: (element: HTMLDivElement) => void
}

const miniMidiContainer = `
  relative
  transition        
  w-full
  p-2
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
  flex justify-between
`
const midiContainer = `
  ${miniMidiContainer}
  ${miniMidiColors}
  flex-col
`
const maxiContainer = `
  fixed
  p-2
  pt-[80px]
  z-50 
  left-0
  top-0
  w-[100vw]
  h-[100vh]  

  bg-red-300
  opacity-50
`

const ProductMiniHeader: Component<{ item: ShoppingItemType }> = (props) => {
  return <div class="whitespace-nowrap">{(props.item.prices[0].normalizedPrice / 100).toFixed(2)} €</div>
}

const ProductMidiHeader: Component<{ item: ShoppingItemType }> = (props) => {
  const context = useProductContext()
  return <Button onClick={() => context.setState('maxi')}>Max</Button>
}

const ProductMaxiHeader: Component<{ item: ShoppingItemType }> = (props) => {
  const context = useProductContext()
  return <Button onClick={() => context.setState('mini')}>X</Button>
}

const ProductMidiContent: Component<{ item: ShoppingItemType }> = (props) => {
  return (
    <div class="flex">
      <div class="w-full text-lg font-mono place-self-end">
        {(props.item.prices[0].normalizedPrice / 100).toFixed(2)} €
      </div>
      <div class="flex-col items-center text-base font-semibold text-gray-900 dark:text-white">
        <div class="text-sm font-medium text-gray-900 truncate dark:text-white">
          {(props.item.prices[0].price / 100).toFixed(2)} €
        </div>
        <div class="text-xs border-t text-gray-500 truncate dark:text-gray-400">
          {amountString(props.item.prices[0].amount, props.item.type)}
        </div>
      </div>
    </div>
  )
}

export const Product: Component<ProductProps & Omit<JSX.HTMLAttributes<HTMLDivElement>, 'ref'>> = (props) => {
  const [, divProps] = splitProps(props, ['item', 'ref'])
  const context = useProductContext()
  const autoAnimate = useAutoAnimate()
  let element: HTMLDivElement
  let shadow: HTMLDivElement

  let lastState: ProductState = context.state()
  let boundingState: DOMRect
  onMount(() => {
    boundingState = element.getBoundingClientRect()
  })
  createRenderEffect(() => {
    if (!element) return
    console.log(boundingState.width, boundingState.height)
    const state = context.state()
    if (lastState !== state) {
      console.log(element.getBoundingClientRect())
      console.log('state change', context.state())
      switch (state) {
        case 'maxi': {
          const { left, top, width, height } = element.getBoundingClientRect()
          shadow.style.width = `${width}px`
          shadow.style.height = `${height}px`
          shadow.style.display = 'block'

          // const deltaX = first.left - last.left;
          // const deltaY = first.top - last.top;
          // const deltaW = first.width / last.width;
          // const deltaH = first.height / last.height;
          // element.style.transform
          break
        }
        default:
          boundingState = element.getBoundingClientRect()
          console.log(boundingState.width, boundingState.height)
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
        <header class="w-full flex">
          <h4
            class="w-full trucate text-lg font-bold leading-none text-gray-900 dark:text-white"
            classList={{ italic: props.item.optimistic }}
            onClick={() =>
              context.setState((state) => {
                if (state === 'mini') return 'midi'
                if (state === 'midi') return 'mini'
                return state
              })
            }
          >
            {props.item.name} - {useProductContext().state()}
          </h4>
          <Switch>
            <Match when={context.state() === 'mini'}>
              <ProductMiniHeader item={props.item} />
            </Match>
            <Match when={context.state() === 'midi'}>
              <ProductMidiHeader item={props.item} />
            </Match>
            <Match when={context.state() === 'maxi'}>
              <ProductMaxiHeader item={props.item} />
            </Match>
          </Switch>
        </header>
        <Switch>
          <Match when={context.state() === 'midi'}>
            <ProductMidiContent item={props.item} />
          </Match>
        </Switch>
      </div>
      <div ref={shadow!}></div>
    </>
  )
}
