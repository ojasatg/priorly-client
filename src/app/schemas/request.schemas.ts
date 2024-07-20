import z from "zod";
import { ETodoBulkOperation } from "$constants/todo.consts";

export const CreateTodoRequestSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(60, "Title cannot be more than 60 characters"),
    isPinned: z.boolean(),
    description: z
        .string()
        .max(150, "Description cannot be more than 150 characters long")
        .nullish(),
    deadline: z.number().nullish(),
    reminder: z.number().nullish(),
    // Have to work on
    color: z.string().nullish(),
    labels: z.array(z.string()).nullish(),
    priority: z.string().nullish(),
});

export const EditTodoChangesSchema = CreateTodoRequestSchema.merge(
    z.object({
        completedOn: z.number().nullish(),
        isDone: z.boolean(),
        isDeleted: z.boolean(),
    }),
).partial();

export const EditTodoRequestSchema = z.object({
    changes: EditTodoChangesSchema,
});
export const AllTodosRequestSchema = z.object({});
export const DeleteTodoRequestSchema = z.object({});
export const TodoDetailsRequestSchema = z.object({});

export const TodoBulkOperationRequestSchema = z.object({
    ids: z.array(z.string()),
    operation: z.nativeEnum(ETodoBulkOperation),
});

export type TCreateTodoRequestSchema = z.infer<typeof CreateTodoRequestSchema>;
export type TEditTodoChangesSchema = z.infer<typeof EditTodoChangesSchema>;
export type TEditTodoRequestSchema = z.infer<typeof EditTodoRequestSchema>;
export type TAllTodosRequestSchema = z.infer<typeof AllTodosRequestSchema>;
export type TDeleteTodoRequestSchema = z.infer<typeof DeleteTodoRequestSchema>;
export type TTodoDetailsRequestSchema = z.infer<typeof TodoDetailsRequestSchema>;
export type TTodoBulkOperationRequestSchema = z.infer<typeof TodoBulkOperationRequestSchema>;
