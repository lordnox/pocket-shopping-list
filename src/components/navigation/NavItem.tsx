import { Component, Show } from 'solid-js'
import { JSX } from 'solid-js/web/types/jsx'
import { A, useLocation } from 'solid-start'
import { ButtonProps, LinkProps, LinkOrButton } from '../Basics'

export const NavItem: Component<
  LinkOrButton & {
    children: JSX.Element
  }
> = (props) => {
  const location = useLocation()
  const isActive = (path: string) => path == location.pathname

  return (
    <div
      class="mx-1.5 border-b-2  transition sm:mx-6"
      classList={{
        'border-secondary-600 dark:text-white': 'href' in props && isActive(props.href),
        'border-transparent dark:text-primary-400 dark:hover:text-white': !('href' in props) || !isActive(props.href),
      }}
    >
      <Show
        when={'href' in props}
        fallback={
          <button type="button" class="block h-full w-full" onClick={(props as ButtonProps).onClick}>
            {props.children}
          </button>
        }
      >
        <A class="block h-full w-full" href={(props as LinkProps).href}>
          {props.children}
        </A>
      </Show>
    </div>
  )
}
