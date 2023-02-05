import { Component, JSX } from 'solid-js'
import { CreateStockList } from '~/types/stock-types'
import { createDiv } from '~/utils/createTag'
import { FAB } from '../Basics'
import { CheckCircle } from '../icons/check-circle'
import { Add, Close } from '../icons/icons'
import { Button } from '../inputs/Button'
import { InputField } from '../inputs/InputField'

const Row = createDiv(`
  flex
  w-full
  gap-2
`)
const Item = createDiv(`
  place-self-end 
  w-full
`)

export interface CreateStockFormProps {
  onEnter: (data: { name: string }) => void
}

export const CreateStockForm: Component<CreateStockFormProps> = (props) => {
  let nameInputElement: HTMLInputElement

  const enterItem: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = async (event) => {
    event.preventDefault()
    if (!nameInputElement) throw new Error('Could not correctly identify form elements')
    const name = nameInputElement.value
    props.onEnter({ name })
  }

  return (
    <form class="m-2 flex flex-1 flex-col gap-2">
      <Row>
        <Item class="place-self-end">
          <InputField for="name" label="Name" placeholder="Name" ref={nameInputElement!} required />
        </Item>
        <button
          class="h-8 place-self-end rounded-lg bg-secondary-700 px-2 text-sm font-medium text-white hover:bg-secondary-800 focus:outline-none focus:ring-4 focus:ring-secondary-300 dark:bg-secondary-600 dark:hover:bg-secondary-700 dark:focus:ring-secondary-800"
          type="submit"
          onClick={enterItem}
        >
          Anlegen
        </button>
      </Row>
    </form>
  )
}
