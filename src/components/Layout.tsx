import { Match, ParentComponent, Show, Switch } from 'solid-js'
import { useSession, isAuthenticated } from '~/utils/auth'
import { LoginButton } from './navigation/LoginButton'
import { NavItem } from './navigation/TopNavItem'
import { UserMenu } from './navigation/UserMenu'

const Navigation = () => {
  const session = useSession()
  return (
    <nav class="fixed z-20 w-full border-primary-200 bg-white px-2 shadow-lg dark:bg-primary-900 sm:px-4">
      <div class="container mx-auto flex flex-wrap items-center justify-start p-4">
        <NavItem href="/" title="Home" />
        <NavItem href="/products" title="Produkte" />
        <NavItem href="/about" title="About" />

        <Show when={session().state === 'LOADED'}>
          <Switch fallback={LoginButton}>
            <Match when={isAuthenticated()}>
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
