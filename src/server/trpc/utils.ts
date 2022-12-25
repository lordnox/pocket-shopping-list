import { initTRPC, TRPCError } from '@trpc/server'
import type { Context } from './context'

export const t = initTRPC.context<Context>().create()

export const router = t.router

export const procedure = t.procedure

export const protectedProcedure = t.procedure.use(
  t.middleware(async ({ ctx, next }) => {
    console.log('request of a resource', ctx.req.url, ctx.user)
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not authorized to access this resource',
      })
    }
    return next({ ctx: { ...ctx, user: ctx.user } })
  }),
)
