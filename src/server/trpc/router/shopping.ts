import { z } from 'zod'
import { router, protectedProcedure, procedure } from '../utils'

export default router({
  shoppingItems: procedure.query(({ ctx: { prisma } }) =>
    prisma.shoppingItem.findMany({
      include: {
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
      }),
    )
    .mutation(async ({ input, ctx: { prisma, user } }) => {
      const item = await prisma.shoppingItem.findFirst({ where: { name: { equals: input.name } } })
      if (item) {
        await prisma.itemPrice.create({
          data: {
            price: input.price,
            itemId: item.id,
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
