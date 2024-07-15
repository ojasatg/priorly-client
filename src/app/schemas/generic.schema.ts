import { z } from "zod";

export const GenericTodoItemSchema = z.object({
    title: z.string().max(60, "Title cannot be more than 60 characters").nullish(),
    isDone: z.boolean(),
    isPinned: z.boolean(),
    description: z
        .string()
        .max(300, "Description cannot be more than 300 characters long")
        .nullish(),
    deadline: z.number().nullish(),
    reminder: z.number().nullish(),
    color: z
        .string()
        .regex(/^#[0-9A-F]{6}[0-9a-f]{0,2}$/i, "Please add a valid color")
        .nullish(),
});
