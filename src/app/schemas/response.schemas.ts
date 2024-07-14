import z from "zod";
import { GenericTodoItemSchema } from "./generic.schema";

export const TodoItemResponseSchema = GenericTodoItemSchema.merge(
    z.object({
        id: z.string(),
        createdOn: z.number(),
        updatedOn: z.number(),
        completedOn: z.number().nullish(),
        isPinned: z.boolean().nullish(),
        isSelected: z.boolean().nullish(),
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

export type TTodoItemResponseSchema = z.infer<typeof TodoItemResponseSchema>;
export type TCreateTodoResponseSchema = z.infer<typeof CreateTodoResponseSchema>;
export type TAllTododsResponseSchema = z.infer<typeof AllTodosResponseSchema>;
export type TDeleteTodoResponseSchema = z.infer<typeof DeleteTodoResponseSchema>;
export type TTodoDetailsResponseSchema = z.infer<typeof TodoDetailsResponseSchema>;
export type TEditTodoResponseSchema = z.infer<typeof EditTodoResponseSchema>;
