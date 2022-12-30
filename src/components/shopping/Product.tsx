import { ItemType } from '@prisma/client'
import { Component, createEffect } from 'solid-js'
import { Product as ShoppingItemType } from '~/types/product-types'
import { createDiv } from '~/utils/createTag'
import { amountTypes } from './amount'
import { useProductDrag } from './product-drag'
import { useProductContext } from './ProductContext'
import { RightActionContainer } from './product-actions/Right-Actions'
import { LeftActionContainer } from './product-actions/Left-Actions'

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
  relative
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

const itemRowCss = `
  ${rowClass}  
  z-20
  border-b
  group-even:bg-gray-100
  group-even:dark:bg-gray-700
  group-odd:dark:bg-gray-800
  dark:border-gray-700
  group-hover:bg-gray-50
  group-hover:dark:bg-gray-600
  touch-pan-y
`

interface ProductProps {
  item: ShoppingItemType
  hasActions?: boolean
  onActionPending: (pending: string) => void
}

export const Product: Component<ProductProps> = (props) => {
  let element: HTMLDivElement

  const reset = () => (element.style.transform = '')

  const [direction, locked] = useProductDrag(() => element, {
    onFinished: (element, state) => {
      element.style.transition = 'transform .2s'
      reset()
      if (state.locked) props.onActionPending(props.item.id)
    },
  })

  const isActive = () => locked() && useProductContext()?.actionPending() === props.item.id
  const isLeft = () => direction() < 0
  const isRight = () => direction() > 0

  createEffect(() => !isActive() && reset())

  return (
    <div class="group relative @container">
      <RightActionContainer active={isActive()} locked={locked()} visible={isRight()} />
      <LeftActionContainer active={isActive()} locked={locked()} visible={isLeft()} />

      {/* <Show when={direction() < 0}>
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
      </Show> */}
      <div
        ref={element!}
        class={itemRowCss}
        classList={{
          'translate-x-full': isRight() && isActive(),
          '-translate-x-full': isLeft() && isActive(),
        }}
      >
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
      </div>
    </div>
  )
}
