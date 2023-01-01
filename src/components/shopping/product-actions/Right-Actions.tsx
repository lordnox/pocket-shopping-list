import autoAnimate from '@formkit/auto-animate'
import { ParentComponent, onMount, Show } from 'solid-js'
import styles from './action.module.css'
import buttonStyles from '~/styles/button.module.css'

interface ContainerProps {
  visible: boolean
  active: boolean
  locked: boolean
}

const RightActionContent: ParentComponent<ContainerProps> = (props) => {
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
        {props.children}
      </Show>
    </div>
  )
}

export const RightActionContainer: ParentComponent<ContainerProps> = (props) => (
  <Show when={props.visible}>
    <RightActionContent {...props} />
  </Show>
)
