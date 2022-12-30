import autoAnimate from '@formkit/auto-animate'
import { Component, onMount, Show } from 'solid-js'
import styles from './action.module.css'

interface ContainerProps {
  visible: boolean
  active: boolean
  locked: boolean
}

const DeleteAction: Component<ContainerProps> = (props) => {
  let element: HTMLDivElement

  onMount(() => {
    autoAnimate(element)
  })

  return (
    <div
      ref={element!}
      class={styles.container}
      classList={{
        ['bg-red-300']: !props.active && !props.locked,
        ['bg-red-500']: !props.active && props.locked,
        ['pointer-events-none']: !props.active,
        ['bg-gray-900']: props.active,
      }}
    >
      <Show when={props.active} fallback={<label>Löschen</label>}>
        <div class={styles.buttonContainer}>
          <button class={[styles.button, styles.deleteColors].join(' ')}>Löschen</button>
          <button class={[styles.button, styles.deleteColors].join(' ')}>Abbrechen</button>
        </div>
      </Show>
    </div>
  )
}

export const RightActionContainer: Component<ContainerProps> = (props) => (
  <Show when={props.visible}>
    <DeleteAction {...props} />
  </Show>
)
