import z from "zod";

export const CreateTodoRequestSchema = z.object({
    title: z.string().max(60, "Title cannot be more than 60 characters").nullish(),
    isPinned: z.boolean(),
    description: z
        .string()
        .max(300, "Description cannot be more than 300 characters long")
        .nullish(),
    deadline: z.number().nullish(),
    reminder: z.number().nullish(),
    color: z.string().nullish(),
});

export const EditTodoChangesSchema = CreateTodoRequestSchema.merge(
    z.object({
        completedOn: z.number().nullish(),
        isDone: z.boolean().nullish(),
    }),
).partial();

export const EditTodoRequestSchema = z.object({
    changes: EditTodoChangesSchema,
});
export const AllTodosRequestSchema = z.object({});
export const DeleteTodoRequestSchema = z.object({});
export const TodoDetailsRequestSchema = z.object({});

export type TCreateTodoRequestSchema = z.infer<typeof CreateTodoRequestSchema>;
export type TEditTodoChangesSchema = z.infer<typeof EditTodoChangesSchema>;
export type TEditTodoRequestSchema = z.infer<typeof EditTodoRequestSchema>;
export type TAllTodosRequestSchema = z.infer<typeof AllTodosRequestSchema>;
export type TDeleteTodoRequestSchema = z.infer<typeof DeleteTodoRequestSchema>;
export type TTodoDetailsRequestSchema = z.infer<typeof TodoDetailsRequestSchema>;
