import { signIn, signOut } from '@solid-auth/next/client'
import { Component, createSignal, Match, ParentComponent, Show, Switch } from 'solid-js'
import { useLocation, A, useIsRouting } from 'solid-start'
import { useSession, session as sessionData } from '~/utils/auth'

const NavItem: Component<{
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

const LoginButton = () => (
  <button class="mr-4 ml-auto transition dark:text-gray-400 dark:hover:text-white " onClick={() => signIn()}>
    Login
  </button>
)

const dropdownClass = 'block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left'
const UserMenu = () => {
  const [open, setOpen] = createSignal(false)
  return (
    <>
      <button
        type="button"
        class="ml-auto inline-flex items-center rounded-full border border-blue-700 text-center text-sm font-medium text-blue-700 hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
        onClick={() => setOpen((open) => !open)}
      >
        <img class="h-10 w-10 rounded-full" src={sessionData()?.user?.image ?? ''} alt="Rounded avatar" />
      </button>

      <div
        class={`${
          open() ? 'fixed' : 'hidden'
        } right-16 top-14 z-30 w-44 divide-y divide-gray-100 rounded bg-white shadow dark:bg-gray-700`}
      >
        <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault">
          <li>
            <button onClick={signOut} class={dropdownClass}>
              Sign out
            </button>
          </li>
        </ul>
      </div>
    </>
  )
}

const Navigation = () => {
  const session = useSession()
  return (
    <nav class="fixed z-20 w-full border-gray-200 bg-white px-2 shadow-lg dark:bg-gray-900 sm:px-4">
      <div class="container mx-auto flex flex-wrap items-center justify-between p-4">
        <NavItem href="/" title="Home" />
        <NavItem href="/about" title="About" />

        <Show when={session().state === 'LOADED'}>
          <Switch fallback={LoginButton}>
            <Match when={sessionData()}>
              <UserMenu />
            </Match>
          </Switch>
        </Show>
      </div>
    </nav>
  )
}
export const Layout: ParentComponent = (props) => {
  return (
    <>
      <Navigation />
      <div class={`pt-[74px] transition-all`}>{props.children}</div>
    </>
  )
}
