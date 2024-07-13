import z from "zod";
import { TodoItemResponseSchema } from "./response.schemas";

export const TodoItemViewSchema = TodoItemResponseSchema.merge(
    z.object({
        isSelected: z.boolean().nullable(),
    }),
);
export type TTodoItemViewSchema = z.infer<typeof TodoItemViewSchema>;
