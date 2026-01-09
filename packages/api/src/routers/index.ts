import type { RouterClient } from "@orpc/server";

import { withTag, withProtectedTag } from "../helpers";
import { todoRouter } from "./todo";

const healthTag = withTag("Health");
const userTag = withProtectedTag("User");

export const appRouter = {
  healthCheck: healthTag.handler(() => {
    return "OK";
  }, "Check API health status"),

  privateData: userTag.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }, "Get private user data"),

  todo: todoRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
