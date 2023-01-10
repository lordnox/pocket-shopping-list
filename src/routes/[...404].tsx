import { A } from 'solid-start'

export default function NotFound() {
  return (
    <main class="mx-auto p-4 text-center text-primary-700">
      <h1 class="max-6-xs my-16 text-6xl font-thin uppercase text-secondary-700">Not Found</h1>
      <p class="mt-8">
        Visit{' '}
        <a href="https://solidjs.com" target="_blank" class="text-secondary-600 hover:underline">
          solidjs.com
        </a>{' '}
        to learn how to build Solid apps.
      </p>
      <p class="my-4">
        <A href="/" class="text-secondary-600 hover:underline">
          Home
        </A>
        {' - '}
        <A href="/about" class="text-secondary-600 hover:underline">
          About Page
        </A>
      </p>
    </main>
  )
}
