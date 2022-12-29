import { Component, For, onMount } from 'solid-js'
import { ShoppingItem } from './item'
import { ShoppingItem as ShoppingItemType } from '~/types/shopping'
import autoAnimate from '@formkit/auto-animate'

export const ShoppingItems: Component<{
  items: ShoppingItemType[]
}> = (props) => {
  let tableElement: HTMLTableElement

  onMount(() => autoAnimate(tableElement))

  return (
    <div class="overflow-x-auto relative shadow-md sm:rounded-lg w-full">
      <table ref={tableElement!} class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="py-3 px-6">
              Produkt
            </th>
            <th scope="col" class="py-3 px-6">
              Preis pro Einheit
            </th>
            <th scope="col" class="py-3 px-6">
              Preis
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
