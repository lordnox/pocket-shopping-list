import { ItemType } from '@prisma/client'
import { Component } from 'solid-js'
import { ShoppingItem as ShoppingItemType } from '~/types/shopping'
import { createDiv } from '~/utils/createTag'
import { amountTypes } from './amount'

const PriceEntry = createDiv(``)

const selectUnit = (amount: number) => (amount >= 1000 ? 1 : 0)

const amountString = (amount: number, type: ItemType) => {
  const unit = selectUnit(amount)
  const number = unit ? (amount / 1000).toFixed(1) : amount.toString()
  return `${number} ${amountTypes[type].unit[unit]}`
}

export const ShoppingItem: Component<{ item: ShoppingItemType }> = (props) => {
  return (
    <tr class="transition-color odd:bg-white border-b even:bg-gray-100 even:dark:bg-gray-700 odd:dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <th
        scope="row"
        classList={{
          ['py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white']: true,
          italic: props.item.optimistic,
        }}
      >
        {props.item.name}
      </th>
      <td class="py-4 px-6">{(props.item.prices[0].normalizedPrice / 100).toFixed(2)} €</td>
      <td class="py-4 px-6">
        <PriceEntry>
          <span>{(props.item.prices[0].price / 100).toFixed(2)} €</span>
          <span> @ {amountString(props.item.prices[0].amount, props.item.type)}</span>
        </PriceEntry>
      </td>
    </tr>
  )
}
