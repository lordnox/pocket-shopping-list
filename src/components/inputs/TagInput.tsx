import { Component, For, JSX, Setter } from 'solid-js'
import { classes } from '~/utils/classes'
import { StopCircle } from '../icons/stop-circle'
import styles from '~/styles/input.module.css'

const keyframes: Keyframe[] = [{ background: 'rgb(239 68 68 / var(--tw-bg-opacity))' }]
const flash = (element: HTMLElement) => {
  element.animate(keyframes, {
    direction: 'alternate',
    duration: 250,
    iterations: 2,
  })
}

export const ShoppingTags: Component<{ for: string; tags: string[]; setTags: Setter<string[]> }> = (props) => {
  let label: HTMLLabelElement

  const captureKey: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (event) => {
    if (event.key === 'Enter') {
      const value = event.currentTarget.value
      if (value === '') return
      event.preventDefault()
      const tag = value.trim()
      if (props.tags.includes(tag)) return flash(label)
      props.setTags([...props.tags, value])
      event.currentTarget.value = ''
    }
  }

  let value: string
  const checkBackspace: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (event) => {
    console.log(event.key, value)
    if (event.key === 'Backspace' && value === '') props.setTags(props.tags.slice(0, -1))
  }

  const updateValue: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (event) => {
    value = event.currentTarget.value
  }

  const removeTag = (value: string) => () => props.setTags(props.tags.filter((tag) => tag !== value))

  return (
    <label
      ref={label!}
      for={props.for}
      class={classes(
        `flex w-full items-center gap-1 rounded-lg border pl-1`,
        styles.inputBgColors,
        styles.inputBorderColors,
        styles.inputFocusColors,
      )}
    >
      <For each={props.tags}>
        {(tag) => (
          <div class="inline-flex select-none flex-nowrap items-center whitespace-nowrap rounded-full bg-gray-800 py-1 px-2 text-xs text-gray-200">
            {tag}
            <StopCircle role="button" class="ml-1 h-4 w-4 stroke-red-400" onClick={removeTag(tag)} />
          </div>
        )}
      </For>
      <input
        onKeyDown={updateValue}
        onKeyPress={captureKey}
        onKeyUp={checkBackspace}
        class={classes(styles.inputTextColors, `h-[30px] w-full border-none bg-transparent py-0 px-1 text-xs`)}
        id={props.for}
        type="text"
        placeholder="Add a tag..."
      />
    </label>
  )
}
