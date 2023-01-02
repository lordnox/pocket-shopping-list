import autoAnimate from '@formkit/auto-animate'
import { ItemType } from '@prisma/client'
import { Component, JSX, Match, onMount, Ref, Setter, Show, splitProps, Switch } from 'solid-js'
import { Product as ShoppingItemType } from '~/types/product-types'
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

const miniMidiColors = `
group-even/product:bg-gray-100
group-even/product:dark:bg-gray-700
group-odd/product:bg-gray-200
group-odd/product:dark:bg-gray-800
group-hover/product:bg-gray-50
group-hover/product:dark:bg-gray-600
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

  let productElement: HTMLDivElement
  const context = useProductContext()

  onMount(() => {
    autoAnimate(productElement)
  })

  return (
    <div
      ref={(element) => {
        productElement = element
        props.ref(element)
      }}
      {...divProps}
      class={classes(
        `
        
        relative
        transition        
        w-full
        p-2
        rounded-lg
        z-20
        touch-pan-y
        `,
      )}
      classList={{
        'flex justify-between': context.state() === 'mini',
        'flex-col': context.state() === 'midi',
        [miniMidiColors]: context.state() !== 'maxi',
        'bg-red-400': context.state() === 'maxi',
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
          {props.item.name}
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
  )
}
