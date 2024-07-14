import z from "zod";
import { TodoItemResponseSchema } from "./response.schemas";

export const TodoItemViewSchema = TodoItemResponseSchema.merge(
    z.object({
        isSelected: z.boolean().nullish(),
    }),
);
export type TTodoItemViewSchema = z.infer<typeof TodoItemViewSchema>;
