import { Component, createSignal, JSX } from 'solid-js'
import { CreateProduct } from '~/types/product-types'
import { createDiv } from '~/utils/createTag'
import { ButtonGroupItems } from '../ButtonGroup'
import { InputField } from '../inputs/InputField'
import { AmountKeys, AmountType, amountTypes, choices } from '../../types/amount'
import { TagInput } from '../inputs/TagInput'
import { AmountInput } from '../inputs/AmountInput'

const Row = createDiv(`
  flex
  w-full
  gap-2
`)
const Item = createDiv(`
  place-self-end 
  w-full
`)

export const CreateProductForm: Component<{ onEnter: (data: CreateProduct) => void }> = (props) => {
  let nameInputElement: HTMLInputElement
  let priceInputElement: HTMLInputElement
  let amountTypeInputElement: HTMLInputElement

  const defaultAmountType: AmountKeys = 'kilogram'

  const [amountType, setAmountType] = createSignal<AmountType>(amountTypes[defaultAmountType])
  const [tags, setTags] = createSignal<string[]>([])

  const enterItem: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = async (event) => {
    event.preventDefault()
    if (!nameInputElement || !priceInputElement) throw new Error('Could not correctly identify form elements')
    const name = nameInputElement.value
    const price = parseInt(priceInputElement.value)
    const amount = parseInt(amountTypeInputElement.value)
    props.onEnter({ name, price, type: amountType().key, amount, tags: tags() })
  }

  return (
    <form class="m-2 flex flex-col gap-2">
      <Row>
        <Item class="place-self-end">
          <InputField for="name" label="Name" placeholder="Name" ref={nameInputElement!} required />
        </Item>
        <Item class="place-self-end">
          <InputField for="price" label="Preis" placeholder="Preis" ref={priceInputElement!} required type="number" />
        </Item>
        <Item class="grid min-w-[165px] max-w-[180px] grid-cols-[1fr_28px_28px_28px]">
          <AmountInput
            amountType={amountType()}
            setAmountType={setAmountType}
            ref={(element) => (amountTypeInputElement = element)}
          />
        </Item>
      </Row>
      <Row>
        <Item>
          <TagInput for="tags" tags={tags()} setTags={setTags} />
        </Item>
        <button
          class="h-8 place-self-end rounded-lg bg-blue-700 px-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="submit"
          onClick={enterItem}
        >
          Eintragen
        </button>
      </Row>
    </form>
  )
}
