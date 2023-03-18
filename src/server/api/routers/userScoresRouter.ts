import { z } from "zod";
import wilksMale from "~/business/wilks";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userScoresRouter = createTRPCRouter({
    create: publicProcedure
        .input(z.object(
            {
                competitorId: z.string(),
                competitorWeight: z.number(),
                squatScore: z.number(),
                deadliftScore: z.number(),
                benchPressScore: z.number()
            }))
        .mutation(({ ctx, input }) => {
            const totalScore = input.squatScore + input.deadliftScore + input.benchPressScore;
            const totalWilks = wilksMale(input.competitorWeight, totalScore);
            return ctx.prisma.userScore.create({
                data: {
                    user: {
                        connect: {
                            id: input.competitorId
                        }
                    },
                    squatScore: input.squatScore,
                    squatWilks: wilksMale(input.competitorWeight, input.squatScore),
                    deadliftScore: input.deadliftScore,
                    deadliftWilks: wilksMale(input.competitorWeight, input.deadliftScore),
                    benchPressScore: input.benchPressScore,
                    benchPressWilks: wilksMale(input.competitorWeight, input.benchPressScore),
                    totalScore: totalScore,
                    totalWilks: totalWilks
                }
            });
        }),
    update: publicProcedure
        .input(z.object(
            {
                scoreId: z.string(),
                competitorWeight: z.number(),
                squatScore: z.number(),
                deadliftScore: z.number(),
                benchPressScore: z.number()
            }))
        .mutation(({ ctx, input }) => {
            const totalScore = input.squatScore + input.deadliftScore + input.benchPressScore;
            const totalWilks = wilksMale(input.competitorWeight, totalScore);
            return ctx.prisma.userScore.update({
                where: {
                    id: input.scoreId,
                },
                data: {
                    squatScore: input.squatScore,
                    squatWilks: wilksMale(input.competitorWeight, input.squatScore),
                    deadliftScore: input.deadliftScore,
                    deadliftWilks: wilksMale(input.competitorWeight, input.deadliftScore),
                    benchPressScore: input.benchPressScore,
                    benchPressWilks: wilksMale(input.competitorWeight, input.benchPressScore),
                    totalScore: totalScore,
                    totalWilks: totalWilks
                }
            });
        }),
    findAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.userScore.findMany({ include: { user: true } });
    }),
    findOne: publicProcedure
        .input(z.object({
            userId: z.string(),
        }))
        .query(({ ctx, input }) => {
            return ctx.prisma.userScore.findMany({
                where: {
                    userId: input.userId
                }
            });
        }),
    delete: publicProcedure
        .input(z.object({
            scoreId: z.string(),
        }))
        .mutation(({ ctx, input }) => {
            return ctx.prisma.userScore.delete({
                where: {
                    id: input.scoreId
                }
            });
        }),
    deleteAll: publicProcedure // TODO: Remove
        .input(z.object({
            userId: z.string(),
        }))
        .mutation(({ ctx, input }) => {
            return ctx.prisma.userScore.deleteMany({
                where: {
                    userId: input.userId
                }
            });
        })
});
