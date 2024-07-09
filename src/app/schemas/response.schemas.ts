import z from "zod";
import { TodoItemSchema } from "./view.schemas";

export const CreateTodoResponseSchema = z.object({
    id: z.string(),
});

export const AllTodosResponseSchema = z.object({
    todos: z.array(TodoItemSchema),
});

export type TCreateTodoResponseSchema = z.infer<typeof CreateTodoResponseSchema>;
export type TAllTododsResponseSchema = z.infer<typeof AllTodosResponseSchema>;
