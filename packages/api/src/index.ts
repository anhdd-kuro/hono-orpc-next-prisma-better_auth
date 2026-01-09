import { ORPCError, os } from "@orpc/server";

import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

const requireAuth = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({
    context: {
      session: context.session,
    },
  });
});

export const protectedProcedure = publicProcedure.use(requireAuth);

export const withTag = <T extends Record<string, any>>(
  tag: string,
  router: T
): T => {
  const result: Record<string, any> = {};

  for (const [key, procedure] of Object.entries(router)) {
    if (procedure && typeof procedure === "object" && "route" in procedure) {
      result[key] = procedure.route({ tags: [tag] });
    } else {
      result[key] = procedure;
    }
  }

  return result as T;
};
