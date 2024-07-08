import { z } from "zod";

export const TodoCreateFormSchema = z.object({
    title: z
        .string()
        .min(1, "Title cannot be empty")
        .max(30, "Title cannot be more that 30 characters long"),
    description: z.string().max(300, "Description cannot be more than 300 characters long"),
    done: z.boolean(),
    deadline: z.string().optional(),
    reminder: z.string().optional(),
});

export type TTodoCreateFormSchema = z.infer<typeof TodoCreateFormSchema>;
