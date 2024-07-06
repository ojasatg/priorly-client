import z from "zod";

export const SchemaViewTodoItem = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    done: z.boolean(),
    created: z.number(),
    updated: z.number(),
    deadline: z.number(),
});

export type TSchemaViewTodoItem = z.infer<typeof SchemaViewTodoItem>;
