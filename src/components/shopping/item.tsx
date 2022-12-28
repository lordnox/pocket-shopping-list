import { Component } from 'solid-js'
import { ShoppingItem as ShoppingItemType } from '~/types/shopping'

export const ShoppingItem: Component<{ item: ShoppingItemType }> = (props) => {
  return (
    <tr class="transition-color odd:bg-white border-b even:bg-gray-100 even:dark:bg-gray-700 odd:dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {props.item.name}
      </th>
      <td class="py-4 px-6">{(props.item.prices[0].normalizedPrice / 100).toFixed(2)} €</td>
      <td class="py-4 px-6">
        <div>{(props.item.prices[0].price / 100).toFixed(2)} €</div>
      </td>
    </tr>
  )
}
