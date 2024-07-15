import { z } from "zod";
import { GenericTodoItemSchema } from "./generic.schema";

export const CreateTodoFormSchema = GenericTodoItemSchema.merge(
    z.object({
        deadline: z.string().nullish(),
        reminder: z.string().nullish(),
        isPinned: z.boolean().nullish(),
        isDone: z.boolean().nullish(),
    }),
);

export type TCreateTodoFormSchema = z.infer<typeof CreateTodoFormSchema>;
