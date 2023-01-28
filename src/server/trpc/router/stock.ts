import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { router, protectedProcedure } from '../utils'

const products = {
  select: {
    id: true,
    name: true,
    product: true,
  },
  orderBy: {
    createdAt: Prisma.SortOrder.desc,
  },
}

export default router({
  stockLists: protectedProcedure.query(({ ctx: { prisma, user } }) =>
    prisma.stockList.findMany({
      select: {
        id: true,
        name: true,
        icon: true,
        products,
      },
      where: {
        userId: user.id,
      },
    }),
  ),

  stockList: protectedProcedure.input(z.string()).query(({ input, ctx: { prisma, user } }) =>
    prisma.stockList.findFirst({
      select: {
        id: true,
        name: true,
        icon: true,
        products: {
          select: {
            id: true,
            name: true,
            product: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      where: {
        userId: user.id,
        id: input,
      },
    }),
  ),

  createStockList: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        icon: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx: { prisma, user } }) => {
      const result = await prisma.stockList.create({
        data: {
          name: input.name,
          userId: user.id,
          icon: input.icon,
        },
        include: {
          products,
        },
      })
      return result
    }),
})
