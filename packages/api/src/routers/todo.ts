import prisma from "@hono-orpc-next-prisma-better_auth/db";
import z from "zod";

import { withTag } from "../helpers";

const todoTag = withTag("Todo");

export const todoRouter = {
  getAll: todoTag.handler(async () => {
    return await prisma.todo.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }, "Get all todos"),

  create: todoTag
    .input(z.object({ text: z.string().min(1) }))
    .handler(async ({ input }) => {
      return await prisma.todo.create({
        data: {
          text: input.text,
        },
      });
    }, "Create a new todo"),

  toggle: todoTag
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .handler(async ({ input }) => {
      return await prisma.todo.update({
        where: { id: input.id },
        data: { completed: input.completed },
      });
    }, "Toggle todo completion status"),

  delete: todoTag
    .input(z.object({ id: z.number() }))
    .handler(async ({ input }) => {
      return await prisma.todo.delete({
        where: { id: input.id },
      });
    }, "Delete a todo"),
};
