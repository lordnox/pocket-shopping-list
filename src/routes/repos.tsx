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
    <main class="text-center mx-auto text-gray-700 p-4">
      <Title class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Repositories</Title>
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Repositories</h1>
      <ErrorBoundary>
        <Repositories />
      </ErrorBoundary>
    </main>
  )
}
