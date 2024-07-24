import { z } from "zod";

export const AllTodosQuerySchema = z
    .object({
        isDone: z.boolean().nullish(),
        isPinned: z.boolean().nullish(),
        cursor: z.number().nullish(),
        limit: z.number().nullish(),
    })
    .partial()
    .nullish();
export const EditTodoQuerySchema = z.object({ id: z.string() });
export const DeleteTodoQuerySchema = EditTodoQuerySchema;
export const TodoDetailsQuerySchema = EditTodoQuerySchema;
export const TodoBulkOperationQuerySchema = z.object({});

export type TAllTodosQuerySchema = z.infer<typeof AllTodosQuerySchema>;
export type TEditTodoQuerySchema = z.infer<typeof EditTodoQuerySchema>;
export type TDeleteTodoQuerySchema = z.infer<typeof DeleteTodoQuerySchema>;
export type TTodoDetailsQuerySchema = z.infer<typeof TodoDetailsQuerySchema>;
export type TodoBulkOperationQuerySchema = z.infer<typeof TodoBulkOperationQuerySchema>;
