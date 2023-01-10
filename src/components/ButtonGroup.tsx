import { Component, createSignal, For } from 'solid-js'

interface ButtonGroupProps<Choices extends Record<string, any>> {
  choices: Choices
  onChange: (choice: Choices[keyof Choices], key: keyof Choices) => void
  active?: keyof Choices
  class?: string
}

const buttonGroupItemCss = `
  py-1
  px-1
  text-sm
  font-medium
  text-primary-900
  first:rounded-l-lg
  last:rounded-r-md
  border-t
  border-b
  first:border
  last:border
  border-primary-200
  focus:z-10
  hover:text-secondary-700
  focus:ring-2
  focus:ring-secondary-700
  focus:text-secondary-700
  dark:border-primary-600
  dark:text-white
  dark:hover:text-white
  dark:focus:ring-secondary-500
  dark:focus:text-white
`

const inactiveButtonGroupItemCss = `
  bg-white
  hover:bg-primary-100
  dark:bg-primary-700
  dark:hover:bg-primary-600
`

const activeButtonGroupItemCss = `
  bg-primary-200
  hover:bg-primary-300
  dark:bg-primary-600
  dark:hover:bg-primary-500
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
          class={props.class}
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
