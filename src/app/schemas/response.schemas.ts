import z from "zod";

export const TodoResponseSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    done: z.boolean(),
    created: z.number(),
    updated: z.number(),
    deadline: z.number(),
    reminder: z.number(),
});

export type TTodoResponseSchema = z.infer<typeof TodoResponseSchema>;
