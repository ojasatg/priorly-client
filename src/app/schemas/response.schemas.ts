import z from "zod";

export const TodoItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullish(),
    done: z.boolean(),
    created: z.number(),
    updated: z.number(),
    deadline: z.number().nullish(),
    reminder: z.number().nullish(),
    completed: z.number().nullish(),
});

export const CreateTodoResponseSchema = z.object({
    todo: TodoItemSchema,
});

export const AllTodosResponseSchema = z.object({
    todos: z.array(TodoItemSchema),
});

export const DeleteTodoResponseSchema = z.object({ id: z.string() });

export type TTodoItemSchema = z.infer<typeof TodoItemSchema>;
export type TCreateTodoResponseSchema = z.infer<typeof CreateTodoResponseSchema>;
export type TAllTododsResponseSchema = z.infer<typeof AllTodosResponseSchema>;
export type TDeleteTodoResponseSchema = z.infer<typeof DeleteTodoResponseSchema>;
