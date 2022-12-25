import type { inferAsyncReturnType } from '@trpc/server'
import { isServer } from 'solid-js/web'
import type { createSolidAPIHandlerContext } from 'solid-start-trpc'
import { sessionFromRequest } from '~/env/solid-auth.config'
import { prisma } from '~/server/db/client'

const fetchUserFromRequest = async (request: Request) => {
  const session = await sessionFromRequest(request)
  console.log(request.url, session, isServer)
  console.log((request as any).cookies)

  if (!session?.user?.email) return

  const data = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      accounts: {
        select: { access_token: true, provider: true, refresh_token: true },
      },
    },
  })

  return data ? data : undefined
}

export const createContextInner = async (opts: createSolidAPIHandlerContext) => {
  const user = await fetchUserFromRequest(opts.req)
  return {
    ...opts,
    prisma,
    user,
  }
}

export const createContext = async (opts: createSolidAPIHandlerContext) => {
  return await createContextInner(opts)
}

export type Context = inferAsyncReturnType<typeof createContext>
