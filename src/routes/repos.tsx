import { ErrorBoundary, Title } from 'solid-start'
import { useRouteData } from 'solid-start'
import { serverSession } from '~/utils/useSession'

import { createServerData$ } from 'solid-start/server'
import { trpc, useQuery } from '~/utils/trpc-client'
import { createMemo, For, Show } from 'solid-js'

export const routeData = () => createServerData$(...serverSession)

const Repositories = () => {
  const [repos] = useQuery('repositories')
  return (
    <ul>
      <For each={repos()}>
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
  )
}

export default () => {
  const user = useRouteData<typeof routeData>()

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <Title class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Repositories</Title>
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Repositories</h1>
      <Show when={user()}>
        <>
          <pre>{JSON.stringify(user(), null, 2)}</pre>
          <ErrorBoundary>
            <Repositories />
          </ErrorBoundary>
        </>
      </Show>
    </main>
  )
}
