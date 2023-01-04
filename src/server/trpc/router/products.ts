import { z } from 'zod'
import { router, protectedProcedure, procedure } from '../utils'
import { amountTypes } from '~/types/amount'

export default router({
  productList: procedure.query(({ ctx: { prisma } }) =>
    prisma.product.findMany({
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

  createOrUpdateProduct: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number().int().positive(),
        // expected to be in ml or g
        amount: z.number(),
        type: z.enum(['kilogram', 'liter', 'piece']),
        tags: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx: { prisma, user } }) => {
      const prices = {
        create: {
          userId: user.id,
          price: input.price,
          amount: input.amount,
          normalizedPrice: Math.floor((input.price / input.amount) * amountTypes[input.type].defaultValue),
        },
      }

      const uppercasedTags = input.tags.map((tag) => tag.toLocaleUpperCase())
      const tags = {
        connectOrCreate: uppercasedTags.map((tag) => ({
          create: {
            name: tag,
          },
          where: {
            name: tag,
          },
        })),
      }

      await prisma.productTag.createMany({
        data: uppercasedTags.map((tag) => ({
          name: tag,
        })),
        skipDuplicates: true,
      })

      const upsert: Parameters<typeof prisma.product.upsert>[0] = {
        create: {
          name: input.name,
          userId: user.id,
          type: input.type,
          prices,
          tags,
        },
        where: {
          name: input.name,
        },
        update: {
          userId: user.id,
          type: input.type,
          prices,
          tags,
        },
      }
      const product = await prisma.product.upsert(upsert)

      return {
        hint: 'created item',
      }
    }),
})
