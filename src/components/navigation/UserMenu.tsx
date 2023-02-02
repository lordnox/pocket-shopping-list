import { signIn, signOut } from '@solid-auth/next/client'
import { AnchorProps, Link } from '@solidjs/router'
import { Accessor, Component, createEffect, createSignal, For, JSX } from 'solid-js'
import { Portal } from 'solid-js/web'
import { session } from '~/utils/auth'
import { classes } from '~/utils/classes'
import { Avatar, createElement } from '../Basics'

type Position = readonly [number, number]
interface DropdownContext {
  anchor: JSX.Element | undefined
  position: Position
}

type DropdownOpenEventHandler = JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
const userDropdownContext = () => {
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

const calculateOpeningPosition = (position: Position, { width, height }: DOMRect): Position => {
  let [x, y] = position
  const bounding = document.body.getBoundingClientRect()
  if (x + width > bounding.width) x -= width
  if (y + height > bounding.height) y -= height
  return [x, y]
}

const DropdownItem = createElement(
  'button',
  'w-full py-2 px-4 text-left hover:bg-primary-100 dark:hover:bg-primary-600 dark:hover:text-white block ',
)
const DropdownLink: Component<AnchorProps> = (props) => (
  <Link
    {...props}
    class={classes(
      'block w-full py-2 px-4 text-left hover:bg-primary-100 dark:hover:bg-primary-600 dark:hover:text-white',
      props.class,
    )}
  />
)

const DropdownElement = createElement('li', 'border-b last:border-b-0')

const Dropdown: Component<{ children: JSX.Element[]; context: Accessor<DropdownContext>; onClose?: VoidFunction }> = (
  props,
) => {
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
    <Portal>
      <div
        class="fixed top-0 left-0 right-0 bottom-0 z-30 backdrop-blur-sm transition"
        classList={{
          'pointer-events-none opacity-0': !open(),
        }}
        onClick={props.onClose}
      >
        <div
          ref={element!}
          class="fixed w-44 divide-y divide-primary-100 rounded bg-white opacity-100 shadow transition-opacity delay-150 dark:bg-primary-700"
          classList={{
            'pointer-events-none opacity-0': !open(),
          }}
        >
          <ul class="py-1 text-sm text-primary-700 dark:text-primary-200" aria-labelledby="dropdownDefault">
            <For each={props.children}>{(child) => <DropdownElement>{child}</DropdownElement>}</For>
          </ul>
        </div>
      </div>
    </Portal>
  )
}

export const UserMenu = () => {
  const [open, context, close] = userDropdownContext()
  return (
    <>
      <Avatar type="button" onClick={open}>
        <img class="h-full w-full" src={session()?.user?.image ?? ''} alt="Rounded avatar" />
      </Avatar>

      <Dropdown context={context} onClose={close}>
        <DropdownItem onClick={signOut}>Sign out</DropdownItem>
        <DropdownLink href="/products">Produkte</DropdownLink>
      </Dropdown>
    </>
  )
}

export const LoginButton: Component = () => {
  return (
    <button
      class="mr-4 ml-auto transition dark:text-primary-400 dark:hover:text-white "
      onClick={(event) => {
        console.log('login!', event)
        signIn()
      }}
    >
      Login
    </button>
  )
}
