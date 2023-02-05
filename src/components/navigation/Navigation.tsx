import { Show } from 'solid-js'
import { navigation } from '~/roots/navigation'
import { isAuthenticated, useSession } from '~/utils/auth'
import { Avatar, H1WithTitle, P } from '../Basics'
import { NavItem } from './NavItem'
import { LoginButton, UserMenu } from './UserMenu'

export const Navigation = () => {
  const session = useSession()
  const { homeAction } = navigation
  return (
    <nav class="fixed z-20 w-full border-primary-200 bg-white bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-primary-900 via-additional-900 to-secondary-600 px-2 shadow-lg dark:bg-primary-900">
      <div class="container mx-auto grid grid-cols-[auto_1fr_auto] items-center justify-center px-2">
        <Show when={homeAction()} fallback={<NavItem href="/">Home</NavItem>}>
          <Avatar {...homeAction()!.props}>{homeAction()?.content}</Avatar>
        </Show>

        <H1WithTitle class="text-center">{navigation.title()}</H1WithTitle>

        <Show when={session().state === 'LOADED'}>
          <Show when={isAuthenticated()} fallback={<LoginButton />}>
            <UserMenu />
          </Show>
        </Show>
      </div>
    </nav>
  )
}
