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
    <div class={`transition border-b-2 ${active(props.href)} mx-1.5 sm:mx-6`}>
      <A class="w-full h-full block" href={props.href}>
        {props.title}
      </A>
    </div>
  )
}

const LoginButton = () => (
  <button class="transition mr-4 ml-auto dark:text-gray-400 dark:hover:text-white " onClick={() => signIn()}>
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
        class="ml-auto text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
        onClick={() => setOpen((open) => !open)}
      >
        <img class="w-10 h-10 rounded-full" src={sessionData()?.user?.image ?? ''} alt="Rounded avatar" />
      </button>

      <div
        class={`${
          open() ? 'fixed' : 'hidden'
        } right-16 top-14 z-30 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700`}
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
    <nav class="z-20 fixed w-full bg-white border-gray-200 px-2 sm:px-4 dark:bg-gray-900 shadow-lg">
      <div class="container p-4 flex flex-wrap items-center justify-between mx-auto">
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
