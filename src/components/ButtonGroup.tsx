import { Component, createSignal, For } from 'solid-js'

interface ButtonGroupProps<Choices extends Record<string, any>> {
  choices: Choices
  onChange: (choice: Choices[keyof Choices], key: keyof Choices) => void
  active?: keyof Choices
}

const buttonGroupItemCss = `
  py-2
  px-4
  text-sm
  font-medium
  text-gray-900
  first:rounded-l-lg
  last:rounded-r-md
  border-t
  border-b
  first:border
  last:border
  border-gray-200
  focus:z-10
  hover:text-blue-700
  focus:ring-2
  focus:ring-blue-700
  focus:text-blue-700
  dark:border-gray-600
  dark:text-white
  dark:hover:text-white
  dark:focus:ring-blue-500
  dark:focus:text-white
`

const inactiveButtonGroupItemCss = `
  bg-white
  hover:bg-gray-100
  dark:bg-gray-700
  dark:hover:bg-gray-600
`

const activeButtonGroupItemCss = `
  bg-gray-200
  hover:bg-gray-300
  dark:bg-gray-600
  dark:hover:bg-gray-500
`

export const ButtonGroupItems = <Choices extends Record<string, any>>(props: ButtonGroupProps<Choices>) => {
  type Keys = keyof Choices
  const [active, setActive] = createSignal(props.active ?? (Object.keys(props.choices)[0] as Keys))

  const select = (choice: Keys) => {
    props.onChange(props.choices[choice], choice)
    if (active() === choice) return
    setActive(() => choice)
  }

  return (
    <For each={Object.keys(props.choices)}>
      {(choice: Keys) => (
        <button
          type="button"
          classList={{
            [buttonGroupItemCss]: true,
            [inactiveButtonGroupItemCss]: active() !== choice,
            [activeButtonGroupItemCss]: active() === choice,
          }}
          onClick={() => select(choice)}
        >
          {props.choices[choice]}
        </button>
      )}
    </For>
  )
}

export const ButtonGroup = <Choices extends Record<string, any>>(props: ButtonGroupProps<Choices>) => (
  <div class="inline-flex h-full rounded-md shadow-sm" role="group">
    <ButtonGroupItems {...props} />
  </div>
)
