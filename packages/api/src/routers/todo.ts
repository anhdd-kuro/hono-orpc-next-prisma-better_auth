import prisma from "@hono-orpc-next-prisma-better_auth/db";
import z from "zod";

import { publicProcedure, withTag } from "../index";

export const todoRouter = withTag("Todo", {
  getAll: publicProcedure
    .route({ summary: "Get all todos" })
    .handler(async () => {
      return await prisma.todo.findMany({
        orderBy: {
          id: "asc",
        },
      });
    }),

  create: publicProcedure
    .route({ summary: "Create a new todo" })
    .input(z.object({ text: z.string().min(1) }))
    .handler(async ({ input }) => {
      return await prisma.todo.create({
        data: {
          text: input.text,
        },
      });
    }),

  toggle: publicProcedure
    .route({ summary: "Toggle todo completion status" })
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .handler(async ({ input }) => {
      return await prisma.todo.update({
        where: { id: input.id },
        data: { completed: input.completed },
      });
    }),

  delete: publicProcedure
    .route({ summary: "Delete a todo" })
    .input(z.object({ id: z.number() }))
    .handler(async ({ input }) => {
      return await prisma.todo.delete({
        where: { id: input.id },
      });
    }),
});
