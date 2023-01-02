import { ItemType } from '@prisma/client'
import { Component, JSX, Setter, splitProps } from 'solid-js'
import { Product as ShoppingItemType } from '~/types/product-types'
import { classes } from '~/utils/classes'
import { amountTypes } from './amount'

const selectUnit = (amount: number) => (amount >= 1000 ? 1 : 0)

const amountString = (amount: number, type: ItemType) => {
  const unit = selectUnit(amount)
  const number = unit ? (amount / 1000).toFixed(1) : amount.toString()
  return `${number} ${amountTypes[type].unit[unit]}`
}

export type ProductState = 'mini' | 'midi' | 'maxi'

export interface ProductProps {
  item: ShoppingItemType
  state: ProductState
  setState: Setter<ProductState>
}

const miniMidiColors = `
group-even/product:bg-gray-100
group-even/product:dark:bg-gray-700
group-odd/product:bg-gray-200
group-odd/product:dark:bg-gray-800
group-hover/product:bg-gray-50
group-hover/product:dark:bg-gray-600
`

export const Product: Component<ProductProps & JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [, divProps] = splitProps(props, ['item', 'ref'])

  return (
    <div
      ref={props.ref}
      {...divProps}
      class={classes(
        `
        relative
        transition
        flex-col
        w-full
        p-2
        rounded-lg
        z-20
        touch-pan-y
        `,
      )}
      classList={{
        [miniMidiColors]: props.state !== 'maxi',
        'bg-red-400': props.state === 'maxi',
      }}
    >
      <h4
        class="trucate text-lg font-bold leading-none text-gray-900 dark:text-white"
        classList={{ italic: props.item.optimistic }}
        onClick={() =>
          props.setState((state) => {
            if (state === 'mini') return 'midi'
            if (state === 'midi') return 'mini'
            return state
          })
        }
      >
        {props.item.name} {props.state}
      </h4>
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
    </div>
  )
}
