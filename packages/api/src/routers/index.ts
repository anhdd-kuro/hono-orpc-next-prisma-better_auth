import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure, withTag } from "../index";
import { todoRouter } from "./todo";

export const appRouter = {
  ...withTag("Health", {
    healthCheck: publicProcedure
      .route({ summary: "Check API health status" })
      .handler(() => {
        return "OK";
      }),
  }),

  ...withTag("User", {
    privateData: protectedProcedure
      .route({ summary: "Get private user data" })
      .handler(({ context }) => {
        return {
          message: "This is private",
          user: context.session?.user,
        };
      }),
  }),

  todo: todoRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
