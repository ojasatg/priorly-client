import z from "zod";
import { TodoItemSchema } from "./response.schemas";

export const TodoItemViewSchema = TodoItemSchema.merge(
    z.object({ loading: z.boolean().optional() }),
);

export type TTodoItemViewSchema = z.infer<typeof TodoItemViewSchema>;
