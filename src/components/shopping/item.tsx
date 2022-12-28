import { Component } from 'solid-js'
import { ShoppingItem as ShoppingItemType } from '~/types/shopping'

export const ShoppingItem: Component<{ item: ShoppingItemType }> = (props) => {
  return (
    <tr class="transition-color odd:bg-white border-b even:bg-gray-100 even:dark:bg-gray-700 odd:dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {props.item.name}
      </th>
      <td class="py-4 px-6">{props.item.tags[0]?.name ?? 'Keine Kategory'}</td>
      <td class="py-4 px-6">{(props.item.prices[0].price / 100).toFixed(2)} €</td>
      {/* <td class="py-4 px-6 text-right">
        <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
          Edit
        </a>
      </td> */}
    </tr>
  )
}
