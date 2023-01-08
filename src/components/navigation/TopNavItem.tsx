import { Component } from 'solid-js'
import { A, useLocation } from 'solid-start'

export const NavItem: Component<{
  href: string
  title: string
}> = (props) => {
  const location = useLocation()
  const active = (path: string) =>
    path == location.pathname
      ? 'border-sky-600 dark:text-white'
      : 'border-transparent dark:text-gray-400 dark:hover:text-white'

  return (
    <div class={`border-b-2 transition ${active(props.href)} mx-1.5 sm:mx-6`}>
      <A class="block h-full w-full" href={props.href}>
        {props.title}
      </A>
    </div>
  )
}
