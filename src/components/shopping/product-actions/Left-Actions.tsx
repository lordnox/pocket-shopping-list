import autoAnimate from '@formkit/auto-animate'
import { onMount, ParentComponent, Show } from 'solid-js'
import styles from './action.module.css'

interface ContainerProps {
  visible: boolean
  active: boolean
  locked: boolean
}

const LeftActionContent: ParentComponent<ContainerProps> = (props) => {
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
        {props.children}
      </Show>
    </div>
  )
}

export const LeftActionContainer: ParentComponent<ContainerProps> = (props) => (
  <Show when={props.visible}>
    <LeftActionContent {...props} />
  </Show>
)
