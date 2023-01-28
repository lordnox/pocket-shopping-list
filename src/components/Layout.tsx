import { Match, ParentComponent, Show, Switch } from 'solid-js'
import { navigation } from '~/roots/navigation'
import { useSession, isAuthenticated } from '~/utils/auth'
import { LoginButton } from './navigation/LoginButton'
import { NavItem } from './navigation/TopNavItem'
import { UserMenu } from './navigation/UserMenu'

const Navigation = () => {
  const session = useSession()
  const { homeAction } = navigation
  return (
    <nav class="fixed z-20 w-full border-primary-200 bg-white bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-primary-900 via-additional-900 to-secondary-600 px-2 shadow-lg dark:bg-primary-900 sm:px-4">
      <div class="container mx-auto flex flex-wrap items-center justify-start p-4">
        <NavItem href="/" title="Home" onClick={homeAction()} />
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
