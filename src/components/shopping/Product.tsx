import { ItemType } from '@prisma/client'
import { Component } from 'solid-js'
import { Product as ShoppingItemType } from '~/types/product-types'
import { amountTypes } from './amount'
import styles from './styles.module.css'

const selectUnit = (amount: number) => (amount >= 1000 ? 1 : 0)

const amountString = (amount: number, type: ItemType) => {
  const unit = selectUnit(amount)
  const number = unit ? (amount / 1000).toFixed(1) : amount.toString()
  return `${number} ${amountTypes[type].unit[unit]}`
}

interface ProductProps {
  item: ShoppingItemType
  hasActions?: boolean
}

export const Product: Component<ProductProps> = (props) => {
  return (
    <>
      <div
        class={styles.product}
        classList={{
          italic: props.item.optimistic,
        }}
      >
        {props.item.name}
      </div>
      <div class="py-4 px-6">{(props.item.prices[0].normalizedPrice / 100).toFixed(2)} €</div>
      <div class="py-4 px-6">
        <div>
          <span>{(props.item.prices[0].price / 100).toFixed(2)} €</span>
          <span> @ {amountString(props.item.prices[0].amount, props.item.type)}</span>
        </div>
      </div>
    </>
  )
}
