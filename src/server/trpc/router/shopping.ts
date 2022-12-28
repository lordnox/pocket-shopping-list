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
        tags: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx: { prisma, user } }) => {
      const item = await prisma.shoppingItem.findFirst({ where: { name: { equals: input.name } } })
      if (item) {
        await prisma.itemPrice.create({
          data: {
            price: input.price,
            itemId: item.id,
            normalizedPrice: Math.floor((input.price / input.amount) * 1000),
          },
        })
        return {
          hint: 'updated item',
        }
      }
      const result = await prisma.shoppingItem.create({
        data: {
          name: input.name,
          userId: user.id,
          prices: {
            create: {
              price: input.price,
              normalizedPrice: Math.floor((input.price / input.amount) * 1000),
            },
          },
        },
      })
      console.log(result)
      return {
        hint: 'created item',
      }
    }),
})
