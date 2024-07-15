import z from "zod";
import { GenericTodoItemSchema } from "./generic.schema";

export const CreateTodoRequestSchema = GenericTodoItemSchema.merge(
    z.object({
        isDone: z.boolean().nullish(),
    }),
);
export const EditTodoRequestSchema = z.object({
    changes: GenericTodoItemSchema.merge(
        z.object({
            completedOn: z.number().nullable(),
        }),
    ).partial(),
});
export const AllTodosRequestSchema = z.object({});
export const DeleteTodoRequestSchema = z.object({});
export const TodoDetailsRequestSchema = z.object({});

export type TCreateTodoRequestSchema = z.infer<typeof CreateTodoRequestSchema>;
export type TEditTodoRequestSchema = z.infer<typeof EditTodoRequestSchema>;
export type TAllTodosRequestSchema = z.infer<typeof AllTodosRequestSchema>;
export type TDeleteTodoRequestSchema = z.infer<typeof DeleteTodoRequestSchema>;
export type TTodoDetailsRequestSchema = z.infer<typeof TodoDetailsRequestSchema>;
