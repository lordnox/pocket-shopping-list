import { ItemType } from '@prisma/client'
import { z } from 'zod'
import { router, protectedProcedure, procedure } from '../utils'

export default router({
  shoppingItems: procedure.query(({ ctx: { prisma } }) =>
    prisma.shoppingItem.findMany({
      include: {
        tags: true,
        prices: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    }),
  ),

  createOrUpdateShoppingItem: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number().int().positive(),
        // expected to be in ml or g
        amount: z.number(),
        type: z.enum(['kilogram', 'liter']),
        tags: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx: { prisma, user } }) => {
      const prices = {
        create: {
          userId: user.id,
          price: input.price,
          amount: input.amount,
          normalizedPrice: Math.floor((input.price / input.amount) * 1000),
        },
      }
      const result = await prisma.shoppingItem.upsert({
        create: {
          name: input.name,
          userId: user.id,
          type: input.type,
          prices,
        },
        where: {
          name: input.name,
        },
        update: {
          userId: user.id,
          type: input.type,
          prices,
        },
      })
      console.log(result)
      return {
        hint: 'created item',
      }
    }),
})
