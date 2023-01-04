import { ErrorBoundary, Title } from 'solid-start'

import { trpc, QueryResult } from '~/utils/trpc-client'
import { createSignal, For, onMount, Show } from 'solid-js'

const Repositories = () => {
  const [repos, setRepositories] = createSignal<QueryResult<'repositories'>>()
  onMount(async () => setRepositories(await trpc.repositories.query()))

  return (
    <Show when={repos()}>
      <ul>
        <For each={repos()!}>
          {(repo) => (
            <li>
              <a href={repo.html_url} target="_blank">
                {repo.name}
              </a>{' '}
              - {repo.private ? 'PRIVATE' : 'PUBLIC'}
            </li>
          )}
        </For>
      </ul>
    </Show>
  )
}

export default () => {
  return (
    <main class="mx-auto p-4 text-center text-gray-700">
      <Title class="max-6-xs my-16 text-6xl font-thin uppercase text-sky-700">Repositories</Title>
      <h1 class="max-6-xs my-16 text-6xl font-thin uppercase text-sky-700">Repositories</h1>
      <ErrorBoundary>
        <Repositories />
      </ErrorBoundary>
    </main>
  )
}
