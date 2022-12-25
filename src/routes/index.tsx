import { signIn, signOut } from '@solid-auth/next/client'
const login = () => signIn('github')
const logout = () => signOut()

export default function Home() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Hello world!</h1>

      <br />

      <p>
        <button onClick={() => signIn()}>Login with Any?</button>
      </p>
      <p>
        <button onClick={() => login()}>Login with Github</button>
      </p>
      <p>
        <button onClick={() => logout()}>Logout</button>
      </p>
    </main>
  )
}
