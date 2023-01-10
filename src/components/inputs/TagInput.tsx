import { Component, For, JSX, Setter } from 'solid-js'
import { classes } from '~/utils/classes'
import { StopCircle } from '../icons/stop-circle'
import styles from '~/styles/input.module.css'
import { capitalize, Tag } from '../Tag'

const keyframes: Keyframe[] = [{ background: 'rgb(239 68 68 / var(--tw-bg-opacity))' }]
const flash = (element: HTMLElement) => {
  element.animate(keyframes, {
    direction: 'alternate',
    duration: 250,
    iterations: 2,
  })
}

export const TagInput: Component<{ for: string; tags: string[]; setTags: Setter<string[]> }> = (props) => {
  let label: HTMLLabelElement

  const captureKey: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (event) => {
    if (event.key === 'Enter') {
      const value = event.currentTarget.value
      if (value === '') return
      event.preventDefault()
      const tag = capitalize(value.trim())
      if (props.tags.includes(tag)) return flash(label)
      props.setTags([...props.tags, tag])
      event.currentTarget.value = ''
    }
  }

  // Alt + Backspace will clear the value after keydown, before keyup. To handle the backspace event
  // during keyup, we need to remember the value on keydown
  let valueOnKeyDown: string
  const checkBackspace: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (event) => {
    if (event.key === 'Backspace' && valueOnKeyDown === '') props.setTags(props.tags.slice(0, -1))
  }

  const updateValue: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (event) => {
    valueOnKeyDown = event.currentTarget.value
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
          <Tag class="bg-primary-800 py-1 px-2 text-[10px] font-normal text-primary-200" onClick={removeTag(tag)}>
            {tag}
          </Tag>
        )}
      </For>
      <input
        onKeyDown={updateValue}
        onKeyPress={captureKey}
        onKeyUp={checkBackspace}
        class={classes(
          styles.inputTextColors,
          `h-[30px] w-full border-none bg-transparent py-0 px-1 text-xs font-normal`,
        )}
        id={props.for}
        type="text"
        placeholder="Add a tag..."
      />
    </label>
  )
}
