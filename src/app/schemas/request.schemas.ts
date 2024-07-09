import z from "zod";

export const CreateTodoRequestSchema = z.object({
    title: z
        .string()
        .min(1, "Title cannot be empty")
        .max(50, "Title cannot be more that 50 characters long"),
    done: z.boolean(),
    description: z
        .string()
        .max(300, "Description cannot be more than 300 characters long")
        .nullish(),
    deadline: z.number().nullish(),
    reminder: z.number().nullish(),
});

export type TCreateTodoRequestSchema = z.infer<typeof CreateTodoRequestSchema>;
