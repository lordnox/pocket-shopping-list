import { signOut } from '@solid-auth/next/client'
import { createSignal } from 'solid-js'
import { session } from '~/utils/auth'

const dropdownClass = 'block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left'
export const UserMenu = () => {
  const [open, setOpen] = createSignal(false)

  return (
    <>
      <button
        type="button"
        class="ml-auto inline-flex items-center rounded-full border border-blue-700 text-center text-sm font-medium text-blue-700 hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
        onClick={() => setOpen((open) => !open)}
      >
        <img class="h-10 w-10 rounded-full" src={session()?.user?.image ?? ''} alt="Rounded avatar" />
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
