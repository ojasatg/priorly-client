import z from "zod";
import { CreateTodoRequestSchema } from "./request.schemas";

export const TodoItemResponseSchema = CreateTodoRequestSchema.merge(
    z.object({
        id: z.string(),
        isDone: z.boolean(),
        isPinned: z.boolean(),
        createdOn: z.number(),
        updatedOn: z.number(),
        completedOn: z.number().nullish(),
    }),
);

export const CreateTodoResponseSchema = z.object({
    todo: TodoItemResponseSchema,
});

export const AllTodosResponseSchema = z.object({
    todos: z.array(TodoItemResponseSchema),
});

export const DeleteTodoResponseSchema = z.object({ id: z.string() });

export const TodoDetailsResponseSchema = z.object({
    todo: TodoItemResponseSchema,
});

export const EditTodoResponseSchema = TodoDetailsResponseSchema;

export const TodoBulkOperationResponseSchema = z.object({
    success: z.array(
        z.object({
            id: z.string(),
            message: z.string(),
        }),
    ),
    error: z.array(
        z.object({
            id: z.string(),
            message: z.string(),
        }),
    ),
});

export type TTodoItemResponseSchema = z.infer<typeof TodoItemResponseSchema>;
export type TCreateTodoResponseSchema = z.infer<typeof CreateTodoResponseSchema>;
export type TAllTododsResponseSchema = z.infer<typeof AllTodosResponseSchema>;
export type TDeleteTodoResponseSchema = z.infer<typeof DeleteTodoResponseSchema>;
export type TTodoDetailsResponseSchema = z.infer<typeof TodoDetailsResponseSchema>;
export type TEditTodoResponseSchema = z.infer<typeof EditTodoResponseSchema>;
export type TTodoBulkOperationResponseSchema = z.infer<typeof TodoBulkOperationResponseSchema>;
