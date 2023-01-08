import { z } from 'zod'
import { router, protectedProcedure, procedure } from '../utils'
import { amountTypes } from '~/types/amount'
import { Prisma, PrismaClient } from '@prisma/client'

const sourceInput = z
  .union([
    z.object({
      webShop: z.object({
        url: z.string(),
      }),
    }),
    z.object({
      location: z.object({
        latitude: z.number(),
        longitude: z.number(),
        accuracy: z.number(),
      }),
    }),
  ])
  .optional()

type SourceInput = z.infer<typeof sourceInput>

const createSource = (sourceInput: SourceInput): undefined | Prisma.SourceCreateInput => {
  if (!sourceInput) return undefined

  if ('location' in sourceInput)
    return {
      GeoLocation: { create: sourceInput.location },
    }

  return {
    WebShop: {
      create: sourceInput.webShop,
    },
  }
}

export default router({
  productList: procedure.query(({ ctx: { prisma } }) =>
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        tags: true,
        prices: {
          select: {
            amount: true,
            normalizedPrice: true,
            price: true,
            source: {
              select: {
                GeoLocation: {
                  select: { latitude: true, longitude: true, accuracy: true, createdAt: true },
                },
                WebShop: {
                  select: { url: true, createdAt: true },
                },
                createdAt: true,
              },
            },
          },
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
        amount: z.number(),
        type: z.enum(['kilogram', 'liter', 'piece']),
        tags: z.array(z.string()),
        source: sourceInput,
      }),
    )
    .mutation(async ({ input, ctx: { prisma, user } }) => {
      const source = await createSource(input.source)

      const sourceId = source
        ? (
            await prisma.source.create({
              data: source,
            })
          ).id
        : undefined

      const prices: Prisma.ProductPriceUncheckedCreateWithoutItemInput = {
        userId: user.id,
        price: input.price,
        amount: input.amount,
        normalizedPrice: Math.floor((input.price / input.amount) * amountTypes[input.type].defaultValue),
        sourceId,
      }

      const tags = input.tags.map((tag) => tag.toLocaleUpperCase())

      const tagsData = tags.map((tag) => ({
        name: tag,
      }))

      await prisma.productTag.createMany({
        data: tagsData,
        skipDuplicates: true,
      })

      const tagIds = (
        await prisma.productTag.findMany({
          where: {
            name: {
              in: tags,
            },
          },
        })
      ).map((tag) => tag.id)

      const product = await prisma.product.upsert({
        create: {
          name: input.name,
          userId: user.id,
          type: input.type,
          prices: { create: prices },
          tags: {
            connect: tagsData,
          },
        },
        where: {
          name: input.name,
        },
        update: {
          userId: user.id,
          type: input.type,
          prices: { create: prices },
          tags: {
            connect: tagsData,
          },
        },
        include: {
          tags: true,
        },
      })

      const tagsToBeRemoved = product.tags.filter((tag) => !tagIds.includes(tag.id))

      console.log(tagIds, product.tags, tagsToBeRemoved)

      await Promise.all(
        tagsToBeRemoved.map((tag) =>
          prisma.product.update({
            data: {
              tags: {
                disconnect: {
                  id: tag.id,
                },
              },
            },
            where: { id: product.id },
          }),
        ),
      )

      return {
        hint: 'created item',
      }
    }),
})
