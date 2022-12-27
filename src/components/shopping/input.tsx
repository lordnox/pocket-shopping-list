import { Component, JSX, Ref } from 'solid-js'
import { ShoppingItemCreate } from '~/types/shopping'

const Input: Component<{
  for: string
  type?: string
  label: string
  placeholder: string
  required?: boolean
  ref: Ref<HTMLInputElement>
}> = (props) => (
  <>
    <label for={props.for} class="text-left block mb-1 text-sm font-medium text-gray-900 dark:text-white">
      {props.label}
    </label>
    <input
      type={props.type ?? 'text'}
      id={props.for}
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder={props.placeholder}
      required={props.required ?? false}
    />
  </>
)

export const ShoppingInput: Component<{ onEnter: (data: ShoppingItemCreate) => void }> = (props) => {
  let textElement: HTMLInputElement
  let numberElement: HTMLInputElement

  const enterItem: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = async (event) => {
    event.preventDefault()
    if (!textElement || !numberElement) throw new Error('Could not correctly identify form elements')
    const name = textElement.value
    const price = parseInt(numberElement.value)
    textElement.value = ''
    numberElement.value = ''
    const result = props.onEnter({ name, price })
  }

  return (
    <form class="flex gap-2 m-2">
      <div class="">
        <Input for="name" label="Name" placeholder="Name" ref={textElement!} required />
      </div>
      <div class="">
        <Input for="price" label="Preis" placeholder="Preis" ref={textElement!} required type="number" />
      </div>
      <button
        class="text-white place-self-end h-10 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="submit"
        onClick={enterItem}
      >
        Eintragen
      </button>
    </form>
  )
}
