import { Octokit } from 'octokit'

export const getOctokit = (auth: string) =>
  new Octokit({
    auth,
    userAgent: 'Home-Server Dashboard',
    timeZone: 'Europe/Berlin',

    log: {
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error,
    },

    // request: {
    //   agent: undefined,
    //   fetch: undefined,
    //   timeout: 0
    // }
  })

type AsyncIteratorContent<Type extends AsyncIterableIterator<any>> = Type extends AsyncIterableIterator<infer R>
  ? R
  : never

export const listRepositories = async (octokit: Octokit) => {
  const iterator = octokit.paginate.iterator(octokit.rest.repos.listForAuthenticatedUser, {
    per_page: 100,
  })

  type Repository = AsyncIteratorContent<typeof iterator>['data'][number]
  const Repositories: Repository[] = []

  for await (const { data: repositories } of iterator) for (const repo of repositories) Repositories.push(repo)

  return Repositories
}
