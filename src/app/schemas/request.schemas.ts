import z from "zod";
import { GenericTodoItemSchema } from "./generic.schema";

export const CreateTodoRequestSchema = GenericTodoItemSchema.merge(
    z.object({
        isPinned: z.boolean().nullish(),
    }),
);

export const AllTodosRequestSchema = z.object({});

export const DeleteTodoRequestSchema = z.object({ id: z.string() });

export type TCreateTodoRequestSchema = z.infer<typeof CreateTodoRequestSchema>;
export type TAllTodosRequestSchema = z.infer<typeof AllTodosRequestSchema>;
export type TDeleteTodoRequestSchema = z.infer<typeof DeleteTodoRequestSchema>;
