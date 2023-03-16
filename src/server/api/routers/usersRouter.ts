import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object(
      {
        name: z.string(),
        weight: z.number(),

      }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.create({
        data: {
          name: input.name,
          weight: input.weight
        }
      });
    }),
  findAll: publicProcedure.query(({ ctx }) => {
    const result = ctx.prisma.user.findMany();
    console.log(result)
    return result;
  }),
  findOne: publicProcedure.
    input(z.object(
      {
        id: z.string(),
      }
    ))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: { id: input.id }
      });
    }),
  delete: publicProcedure
    .input(z.object(
      {
        id: z.string(),
      }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.delete({
        where: {
          id: input.id
        }
      })
    }),
  update: publicProcedure
    .input(z.object(
      {
        id: z.string(),
        name: z.string(),
        weight: z.number(),
      }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: input.id
        },
        data: {
          name: input.name,
          weight: input.weight
        }
      });
    }),
});
