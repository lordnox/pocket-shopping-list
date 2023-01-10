import { signIn } from '@solid-auth/next/client'

export const LoginButton = () => (
  <button class="mr-4 ml-auto transition dark:text-primary-400 dark:hover:text-white " onClick={() => signIn()}>
    Login
  </button>
)
