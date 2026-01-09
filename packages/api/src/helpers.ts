import { os } from "@orpc/server";

import type { Context } from "./context";

export const withTag = (tag: string) => {
  return {
    handler: (fn: (...args: any[]) => any, summary?: string) => {
      const procedure = os.$context<Context>().handler(fn);
      if (summary) {
        return procedure.route({ tags: [tag], summary });
      }
      return procedure.route({ tags: [tag] });
    },
    input: (schema: any) => ({
      handler: (fn: (params: any) => Promise<any>, summary?: string) => {
        const procedure = os.$context<Context>().input(schema).handler(fn);
        if (summary) {
          return procedure.route({ tags: [tag], summary });
        }
        return procedure.route({ tags: [tag] });
      },
    }),
  };
};

export const withProtectedTag = (tag: string) => {
  return {
    handler: (fn: (...args: any[]) => any, summary?: string) => {
      const procedure = os
        .$context<Context>()
        .use(async ({ context, next }) => {
          if (!context.session?.user) {
            throw new Error("UNAUTHORIZED");
          }
          return next();
        })
        .handler(fn);
      if (summary) {
        return procedure.route({ tags: [tag], summary });
      }
      return procedure.route({ tags: [tag] });
    },
    input: (schema: any) => ({
      handler: (fn: (params: any) => Promise<any>, summary?: string) => {
        const procedure = os
          .$context<Context>()
          .use(async ({ context, next }) => {
            if (!context.session?.user) {
              throw new Error("UNAUTHORIZED");
            }
            return next();
          })
          .input(schema)
          .handler(fn);
        if (summary) {
          return procedure.route({ tags: [tag], summary });
        }
        return procedure.route({ tags: [tag] });
      },
    }),
  };
};
