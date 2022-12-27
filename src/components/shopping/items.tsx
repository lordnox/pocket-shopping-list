import { Component, For } from 'solid-js'
import { ShoppingItem } from './item'
import { ShoppingItem as ShoppingItemType } from '~/types/shopping'

export const ShoppingItems: Component<{
  items: ShoppingItemType[]
}> = (props) => {
  return (
    <div class="overflow-x-auto relative shadow-md sm:rounded-lg w-full">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="py-3 px-6">
              Product name
            </th>
            <th scope="col" class="py-3 px-6">
              Category
            </th>
            <th scope="col" class="py-3 px-6">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          <For each={props.items}>{(item) => <ShoppingItem item={item} />}</For>
        </tbody>
      </table>
    </div>
  )
}
