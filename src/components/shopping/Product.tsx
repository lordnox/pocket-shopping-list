import { ItemType } from '@prisma/client'
import { Component, createSignal, onCleanup, onMount, Show } from 'solid-js'
import { Product as ShoppingItemType } from '~/types/product-types'
import { createDiv } from '~/utils/createTag'
import { amountTypes } from './amount'
import { DragGesture } from '@use-gesture/vanilla'
import { useSession } from '~/utils/auth'

const PriceEntry = createDiv(``)

const LOCK_IN_FACTOR = 0.3
const LOCK_IN_MIN = 100
const LOCK_IN_MAX = 150
const LOCK_OFF_FACTOR = 0.2
const LOCK_OFF_MIN = 80
const LOCK_OFF_MAX = 120

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

export const Product: Component<{ item: ShoppingItemType; hasActions?: boolean }> = (props) => {
  let element: HTMLDivElement

  const [dragState, setDragState] = createSignal(0)
  const [locked, setLocked] = createSignal(false)

  let gesture: DragGesture

  if (props.hasActions)
    onMount(() => {
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
          const width = element.getBoundingClientRect().width
          const locked = Math.abs(movement[0]) > Math.max(Math.min(width * LOCK_IN_FACTOR, LOCK_IN_MIN), LOCK_IN_MAX)
          const unlocked =
            Math.abs(movement[0]) < Math.max(Math.min(width * LOCK_OFF_FACTOR, LOCK_OFF_MIN), LOCK_OFF_MAX)
          setLocked((currentlyLocked) => (currentlyLocked && unlocked ? false : currentlyLocked || locked))
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
    <div class="group relative @container">
      <Show when={dragState() > 0}>
        <div
          class={continerCss}
          classList={{
            ['bg-red-300']: !locked(),
            ['bg-red-500']: locked(),
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
            ['bg-green-300']: !locked(),
            ['bg-green-500']: locked(),
            ['justify-end']: true,
          }}
        >
          Update
        </div>
      </Show>
      <ItemRow ref={element!}>
        <div
          classList={{
            ['py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white']: true,
            italic: props.item.optimistic,
          }}
        >
          {props.item.name}
        </div>
        <div class="py-4 px-6">{(props.item.prices[0].normalizedPrice / 100).toFixed(2)} €</div>
        <div class="py-4 px-6">
          <PriceEntry>
            <span>{(props.item.prices[0].price / 100).toFixed(2)} €</span>
            <span> @ {amountString(props.item.prices[0].amount, props.item.type)}</span>
          </PriceEntry>
        </div>
      </ItemRow>
    </div>
  )
}
