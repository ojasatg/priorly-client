import z from "zod";

export const TodoResponseSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    done: z.boolean(),
    created: z.number(),
    updated: z.number(),
    deadline: z.number().nullish(),
    reminder: z.number().nullish(),
    completed: z.number().nullish(),
});

export type TTodoResponseSchema = z.infer<typeof TodoResponseSchema>;
