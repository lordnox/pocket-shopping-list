import { createSignal } from 'solid-js'
import { onMount, ParentComponent, Show, splitProps } from 'solid-js'
import { JSX } from 'solid-js/web/types/jsx'
import { ClassList } from '~/utils/createTag'

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

const Children: ParentComponent = (props) => {
  const [init, setInit] = createSignal(false)
  onMount(() => setTimeout(() => setInit(true), 1))
  return (
    <div
      class={`
        transition
        origin-top
        w-full
      `}
      classList={{
        'scale-y-0': !init(),
        'scale-100': init(),
      }}
    >
      {props.children}
    </div>
  )
}

const Content: ParentComponent<ContentProps> = (props) => {
  return (
    <div
      class={`
        z-10
        w-full
        h-full
        top-0
        left-0 
        flex
        rounded-lg
        absolute  
        group-last:rounded-b-lg
        items-center
        p-2
        font-bold
        text-white
      `}
      classList={{
        [props.bgColor]: !props.active && !props.locked,
        [props.bgLockedColor]: !props.active && props.locked,
        ['pointer-events-none']: !props.active,
        [props.bgActiveColor]: props.active,
        ...props.classList,
      }}
    >
      <Show when={props.active} fallback={props.fallback}>
        <Children>{props.children}</Children>
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