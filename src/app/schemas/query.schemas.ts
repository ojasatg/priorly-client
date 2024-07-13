import { z } from "zod";

export const AllTodosQuerySchema = z.object({});
export const EditTodoQuerySchema = z.object({ id: z.string() });
export const DeleteTodoQuerySchema = EditTodoQuerySchema;
export const TodoDetailsQuerySchema = EditTodoQuerySchema;

export type TAllTodosQuerySchema = z.infer<typeof AllTodosQuerySchema>;
export type TEditTodoQuerySchema = z.infer<typeof EditTodoQuerySchema>;
export type TDeleteTodoQuerySchema = z.infer<typeof DeleteTodoQuerySchema>;
export type TTodoDetailsQuerySchema = z.infer<typeof TodoDetailsQuerySchema>;
