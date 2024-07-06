import { getCurrentTimeStamp } from "$lib/utils/datetime.utils";
import z from "zod";

export const AddTodoReuestSchema = z.object({
    title: z
        .string()
        .min(1, "Title cannot be empty")
        .max(30, "Title cannot be more that 30 characters long"),
    description: z.string().max(300, "Description cannot be more than 300 characters long"),
    done: z.boolean(),
    deadline: z.number().min(getCurrentTimeStamp(), "Date cannot be less than today").optional(),
    reminder: z.number().min(getCurrentTimeStamp(), "Date cannot be less than today").optional(),
});

export type TAddTodoReuestSchema = z.infer<typeof AddTodoReuestSchema>;
