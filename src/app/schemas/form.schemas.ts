import { z } from "zod";

export const CreateTodoFormSchema = z.object({
    title: z
        .string()
        .min(1, "Title cannot be empty")
        .max(50, "Title cannot be more that 50 characters long"),
    done: z.boolean(),
    description: z
        .string()
        .max(300, "Description cannot be more than 300 characters long")
        .nullish(),
    deadline: z.string().nullish(),
    reminder: z.string().nullish(),
});

export type TCreateTodoFormSchema = z.infer<typeof CreateTodoFormSchema>;
