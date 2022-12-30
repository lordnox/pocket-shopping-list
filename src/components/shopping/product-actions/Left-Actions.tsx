import autoAnimate from '@formkit/auto-animate'
import { Component, onMount, Show } from 'solid-js'
import { CheckCircle } from '~/components/icons/check-circle'
import { StopCircle } from '~/components/icons/stop-circle'
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
        ['justify-end']: true,
        ['bg-green-300']: !props.active && !props.locked,
        ['bg-green-500']: !props.active && props.locked,
        ['pointer-events-none']: !props.active,
        ['bg-gray-900']: props.active,
      }}
    >
      <Show when={props.active} fallback={<label>Update</label>}>
        <div class={styles.updateContainer}>
          <input />
          <div class="flex gap-2">
            <button class={[styles.button, styles.updateColors].join(' ')}>
              <CheckCircle /> Eintragen
            </button>
            <button class={[styles.button, styles.abortColors].join(' ')}>
              <StopCircle />
            </button>
          </div>
        </div>
      </Show>
    </div>
  )
}

export const LeftActionContainer: Component<ContainerProps> = (props) => (
  <Show when={props.visible}>
    <DeleteAction {...props} />
  </Show>
)
