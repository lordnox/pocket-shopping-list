import { APIEvent } from 'solid-start'
import { sessionFromRequest } from '~/env/solid-auth.config'
import { Octokit } from 'octokit'
import { prisma } from '~/server/db/client'

const getOctokit = (auth: string) =>
  new Octokit({
    auth,
    userAgent: 'myApp v1.2.3',
    timeZone: 'Europe/Amsterdam',

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

export const GET = async (event: APIEvent) => {
  const result = await sessionFromRequest(event.request)
  console.log(result?.user)

  if (!result?.user?.email)
    return new Response(
      JSON.stringify({
        not: 'Authenticated',
      }),
    )

  const data = await prisma.user.findUnique({
    where: { email: result.user.email },
    include: {
      accounts: {
        select: { access_token: true },
        where: { provider: 'github' },
      },
    },
  })

  const account = data?.accounts[0]

  if (!account?.access_token)
    return new Response(
      JSON.stringify({
        not: 'Account found',
      }),
    )

  const octokit = getOctokit(account.access_token)

  const iterator = octokit.paginate.iterator(octokit.rest.repos.listForAuthenticatedUser, {
    per_page: 100,
  })

  const repos: any[] = []
  // iterate through each response
  for await (const { data: repositories } of iterator) {
    for (const repo of repositories) {
      repos.push(repo)
    }
  }

  // const repos = await octokit.rest.repos.listForAuthenticatedUser()
  return new Response(JSON.stringify(repos))
}
