import { Component, JSX, splitProps } from 'solid-js'
import { ProductType, ProductPrice } from '~/types/product-types'
import { amountString, priceString } from '../../types/amount'

export const AveragePrice: Component<
  { price: ProductPrice; type: ProductType } & JSX.HTMLAttributes<HTMLDivElement>
> = (props) => {
  const [, divProps] = splitProps(props, ['price'])
  return <div {...divProps}>{priceString(props.price.normalizedPrice, props.type)}</div>
}
export const InputPrice: Component<{ price: ProductPrice; type: ProductType } & JSX.HTMLAttributes<HTMLDivElement>> = (
  props,
) => {
  const [, divProps] = splitProps(props, ['price'])
  return (
    <div {...divProps}>
      <div class="truncate text-sm font-medium text-gray-900 dark:text-white">
        {priceString(props.price.price, props.type)}
      </div>
      <div class="truncate border-t text-xs text-gray-500 dark:text-gray-400">
        {amountString(props.price.amount, props.type)}
      </div>
    </div>
  )
}
