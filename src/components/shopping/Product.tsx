import { ItemType } from '@prisma/client'
import { Component, createSignal, onCleanup, onMount, Show } from 'solid-js'
import { Product as ShoppingItemType } from '~/types/product-types'
import { createDiv } from '~/utils/createTag'
import { amountTypes } from './amount'
import { DragGesture, Gesture } from '@use-gesture/vanilla'

const PriceEntry = createDiv(``)

const WIDTH_FACTOR = 0.3 // 20%

const HeaderItem = createDiv(`
  py-3
  px-6
`)
const selectUnit = (amount: number) => (amount >= 1000 ? 1 : 0)

const amountString = (amount: number, type: ItemType) => {
  const unit = selectUnit(amount)
  const number = unit ? (amount / 1000).toFixed(1) : amount.toString()
  return `${number} ${amountTypes[type].unit[unit]}`
}

export const Header = () => (
  <HeaderRow>
    <HeaderItem>Produkt</HeaderItem>
    <HeaderItem>Einheit</HeaderItem>
    <HeaderItem>Preis</HeaderItem>
  </HeaderRow>
)

const rowClass = `
  transition-color
  grid
  grid-cols-[1fr_100px_150px]
  w-full
  group-last:rounded-b-lg
`

const HeaderRow = createDiv(`
  ${rowClass}
  rounded-t-lg
  text-xs
  text-gray-600
  uppercase
  bg-gray-50
  dark:bg-gray-600
  dark:text-gray-300
`)

const ItemRow = createDiv(`
  ${rowClass}
  border-b
  group-even:bg-gray-100
  group-even:dark:bg-gray-700
  group-odd:dark:bg-gray-800
  dark:border-gray-700
  group-hover:bg-gray-50
  group-hover:dark:bg-gray-600
  touch-pan-y
`)

const continerCss = `
  w-full
  h-full
  top-0
  left-0 
  flex
  absolute
  pointer-events-none
  group-last:rounded-b-lg
  items-center
  p-2
  font-bold
  text-white
  transition
`

export const Product: Component<{ item: ShoppingItemType }> = (props) => {
  let element: HTMLDivElement

  const [dragState, setDragState] = createSignal(0)
  const [width, setWidth] = createSignal(0)

  let gesture: DragGesture

  onMount(() => {
    setWidth(element.getBoundingClientRect().width * WIDTH_FACTOR)
    gesture = new DragGesture(
      element,
      ({ movement, first, last }) => {
        if (first) {
          element.style.transition = 'none'
          return
        }
        if (last) {
          element.style.transition = 'transform .2s'
          element.style.transform = 'translate(0px)'
          // handle events here
          return
        }
        setWidth(element.getBoundingClientRect().width * WIDTH_FACTOR)
        element.style.transform = `translate(${movement[0]}px)`
        setDragState(movement[0])
      },
      {
        axis: 'x',
      },
    )
  })

  onCleanup(() => gesture?.destroy())

  return (
    <div class="group relative">
      <Show when={dragState() > 0}>
        <div
          class={continerCss}
          classList={{
            ['bg-red-300']: dragState() <= width(),
            ['bg-red-500']: dragState() > width(),
            ['justify-start']: true,
          }}
        >
          Löschen
        </div>
      </Show>
      <Show when={dragState() < 0}>
        <div
          class={continerCss}
          classList={{
            ['bg-green-300']: -dragState() <= width(),
            ['bg-green-500']: -dragState() > width(),
            ['justify-end']: true,
          }}
        >
          Update
        </div>
      </Show>
      <ItemRow ref={element!}>
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
      </ItemRow>
    </div>
  )
}
