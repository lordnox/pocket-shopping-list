import { ParentComponent, Show, splitProps } from 'solid-js'
import { JSX } from 'solid-js/web/types/jsx'
import { ClassList, WithClassOrClassList } from '~/utils/createTag'
import styles from './action.module.css'

interface ContentProps {
  active: boolean
  locked: boolean
  bgColor: string
  bgLockedColor: string
  bgActiveColor: string
  fallback: JSX.Element
  classList?: ClassList
}

interface ContainerProps extends ContentProps {
  visible: boolean
}

export type TransientContainerProps = Omit<ContainerProps, 'bgColor' | 'bgLockedColor' | 'bgActiveColor' | 'fallback'>

const Content: ParentComponent<ContentProps> = (props) => {
  return (
    <div
      class={styles.container}
      classList={{
        [props.bgColor]: !props.active && !props.locked,
        [props.bgLockedColor]: !props.active && props.locked,
        ['pointer-events-none']: !props.active,
        [props.bgActiveColor]: props.active,
        ...props.classList,
      }}
    >
      <Show when={props.active} fallback={props.fallback}>
        {props.children}
      </Show>
    </div>
  )
}

export const Container: ParentComponent<ContainerProps> = (props) => {
  const [, contentProps] = splitProps(props, ['visible'])
  return (
    <Show when={props.visible}>
      <Content {...contentProps} />
    </Show>
  )
}

export const LeftActionContainer: ParentComponent<TransientContainerProps> = (props) => (
  <Container
    {...props}
    classList={{ ['justify-end']: true }}
    bgColor="bg-green-300"
    bgLockedColor="bg-green-500"
    bgActiveColor="bg-gray-900"
    fallback={<label>Update</label>}
  />
)

export const RightActionContainer: ParentComponent<TransientContainerProps> = (props) => (
  <Container
    {...props}
    bgColor="bg-red-300"
    bgLockedColor="bg-red-500"
    bgActiveColor="bg-gray-900"
    fallback={<label>Löschen</label>}
  />
)
