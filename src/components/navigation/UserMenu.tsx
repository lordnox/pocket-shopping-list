import { signOut } from '@solid-auth/next/client'
import { createSignal } from 'solid-js'
import { session } from '~/utils/auth'
import { geolocation } from '~/utils/geolocation'

const dropdownClass =
  'block py-2 px-4 hover:bg-primary-100 dark:hover:bg-primary-600 dark:hover:text-white w-full text-left'
export const UserMenu = () => {
  const [open, setOpen] = createSignal(false)

  return (
    <>
      <div>{geolocation.hasPermission()}</div>
      <button
        type="button"
        class="ml-auto inline-flex items-center rounded-full border border-secondary-700 text-center text-sm font-medium text-secondary-700 hover:bg-secondary-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-secondary-300 dark:border-secondary-500 dark:text-secondary-500 dark:hover:text-white dark:focus:ring-secondary-800"
        onClick={() => setOpen((open) => !open)}
      >
        <img class="h-10 w-10 rounded-full" src={session()?.user?.image ?? ''} alt="Rounded avatar" />
      </button>

      <div
        class={`${
          open() ? 'fixed' : 'hidden'
        } right-16 top-14 z-30 w-44 divide-y divide-primary-100 rounded bg-white shadow dark:bg-primary-700`}
      >
        <ul class="py-1 text-sm text-primary-700 dark:text-primary-200" aria-labelledby="dropdownDefault">
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
