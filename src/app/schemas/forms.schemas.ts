import z from "zod";

export const SchemaFormTodoItem = z.object({
    title: z
        .string({
            required_error: "Title is required",
        })
        .max(30, "Title cannot be more that 30 characters long"),
    description: z.string().max(300, "Description cannot be more than 300 characters long"),
    done: z.boolean(),
    deadline: z.string().datetime({ message: "Please enter a valid date" }),
});

export type TSchemaFormTodoItem = z.infer<typeof SchemaFormTodoItem>;
