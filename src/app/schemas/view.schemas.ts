import z from "zod";
import { TodoItemResponseSchema } from "./response.schemas";

export const TodoItemViewSchema = TodoItemResponseSchema;
export type TTodoItemViewSchema = z.infer<typeof TodoItemViewSchema>;
