import z from "zod";

export const CreateTodoResponseSchema = z.object({
    id: z.string(),
});

export type TCreateTodoResponseSchema = z.infer<typeof CreateTodoResponseSchema>;
