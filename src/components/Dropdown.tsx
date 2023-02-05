import { AnchorProps, Link } from '@solidjs/router'
import { JSX, createSignal, Component, Accessor, createEffect, For, Show } from 'solid-js'
import { classes } from '~/utils/classes'
import { Backdrop } from './Backdrop'
import { createElement } from './Basics'

const calculateOpeningPosition = (position: Position, { width, height }: DOMRect): Position => {
  let [x, y] = position
  const bounding = document.body.getBoundingClientRect()
  if (x + width > bounding.width) x -= width
  if (y + height > bounding.height) y -= height
  return [x, y]
}
type Position = readonly [number, number]
interface DropdownContext {
  anchor: JSX.Element | undefined
  position: Position
}

type DropdownOpenEventHandler = JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>

export const useDropdownContext = () => {
  const [context, setContext] = createSignal<DropdownContext>({
    anchor: undefined,
    position: [0, 0],
  })

  const closePoint = ({ position }: DropdownContext) => ({
    anchor: undefined,
    position,
  })

  const close = () => setContext(closePoint)

  const open: DropdownOpenEventHandler = (event) =>
    setContext((context) => {
      const { target } = event
      const position = [event.clientX, event.clientY] as const
      if (context.anchor === target) return closePoint(context)
      return {
        anchor: target,
        position,
      }
    })

  return [open, context, close] as const
}

export const DropdownItem = createElement(
  'button',
  'w-full py-2 px-4 text-left hover:bg-primary-100 dark:hover:bg-primary-600 dark:hover:text-white block ',
)
export const DropdownLink: Component<AnchorProps> = (props) => (
  <Link
    {...props}
    class={classes(
      'block w-full py-2 px-4 text-left hover:bg-primary-100 dark:hover:bg-primary-600 dark:hover:text-white',
      props.class,
    )}
  />
)

const DropdownElement = createElement('li', 'border-b last:border-b-0')

export const Dropdown: Component<{
  title?: string
  children: JSX.Element[]
  context: Accessor<DropdownContext>
  onClose?: VoidFunction
}> = (props) => {
  let element: HTMLDivElement

  const open = () => {
    return !!props.context().anchor
  }

  createEffect(() => {
    const [left, top] = calculateOpeningPosition(props.context().position, element.getBoundingClientRect())
    element.style.top = `${top}px`
    element.style.left = `${left}px`
  })

  return (
    <Backdrop onClick={props.onClose} open={!open()}>
      <div
        ref={element!}
        class="fixed w-44 divide-y divide-primary-100 rounded bg-white opacity-100 shadow transition-opacity delay-150 dark:bg-primary-700"
        classList={{
          'opacity-0': !open(),
        }}
      >
        <Show when={props.title}>
          <div class="flex justify-center text-sm font-bold text-primary-200">{props.title}</div>
        </Show>
        <ul class="py-1 text-sm text-primary-700 dark:text-primary-200" aria-labelledby="dropdownDefault">
          <For each={props.children}>{(child) => <DropdownElement>{child}</DropdownElement>}</For>
        </ul>
      </div>
    </Backdrop>
  )
}
