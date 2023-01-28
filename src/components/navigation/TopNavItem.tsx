import { Component } from 'solid-js'
import { JSX } from 'solid-js/web/types/jsx'
import { A, useLocation } from 'solid-start'

export const NavItem: Component<{
  href: string
  title: string
  onClick?: JSX.EventHandlerUnion<HTMLAnchorElement, MouseEvent>
}> = (props) => {
  const location = useLocation()
  const active = (path: string) =>
    path == location.pathname
      ? 'border-secondary-600 dark:text-white'
      : 'border-transparent dark:text-primary-400 dark:hover:text-white'

  return (
    <div class={`border-b-2 transition ${active(props.href)} mx-1.5 sm:mx-6`}>
      <A class="block h-full w-full" href={props.href} onClick={props.onClick}>
        {props.title}
      </A>
    </div>
  )
}
