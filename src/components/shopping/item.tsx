import { ItemType } from '@prisma/client'
import { Component, createSignal, onMount, ParentComponent, Show } from 'solid-js'
import { ShoppingItem as ShoppingItemType } from '~/types/shopping'
import { createDiv } from '~/utils/createTag'
import { amountTypes } from './amount'
import { DragGesture } from '@use-gesture/vanilla'

const PriceEntry = createDiv(``)

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
  touch-none
`)

const Container = createDiv(`
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
`)

export const ShoppingItem: Component<{ item: ShoppingItemType }> = (props) => {
  let element: HTMLDivElement

  const [dragState, setDragState] = createSignal(0)

  onMount(() => {
    const gesture = new DragGesture(
      element,
      ({ delta, movement, first, last }) => {
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
        console.log(delta, movement)
        element.style.transform = `translate(${movement[0]}px)`
        setDragState(movement[0])
        console.log(element.style.transform)
      },
      {
        axis: 'x',
      },
    )
  })

  // const bind = useDrag(
  //   ({ last, velocity: [, vy], direction: [, dy], movement: [, my], cancel, canceled }) => {
  //     // if the user drags up passed a threshold, then we cancel
  //     // the drag so that the sheet resets to its open position
  //     if (my < -70) cancel()

  //     // when the user releases the sheet, we check whether it passed
  //     // the threshold for it to close, or if we reset it to its open positino
  //     if (last) {
  //       my > height * 0.5 || (vy > 0.5 && dy > 0) ? close(vy) : open({ canceled })
  //     }
  //     // when the user keeps dragging, we just move the sheet according to
  //     // the cursor position
  //     else api.start({ y: my, immediate: true })
  //   },
  //   { from: () => [0, y.get()], filterTaps: true, bounds: { top: 0 }, rubberband: true }
  // )

  return (
    <div class="group relative">
      <Show when={dragState() > 0}>
        <Container class={`bg-red-300 justify-start`}>Löschen</Container>
      </Show>
      <Show when={dragState() < 0}>
        <Container class={`bg-green-300 justify-end`}>Update</Container>
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
