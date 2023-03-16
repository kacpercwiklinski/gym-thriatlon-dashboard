import { createTRPCRouter } from "~/server/api/trpc";
import { usersRouter } from "~/server/api/routers/usersRouter";
import { userScoresRouter } from "./routers/userScoresRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  userScoresRouter: userScoresRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
