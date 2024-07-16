import { z } from "zod";
import { CreateTodoRequestSchema } from "./request.schemas";

export const CreateTodoFormSchema = CreateTodoRequestSchema.merge(
    z.object({
        deadline: z.string().nullish(),
        reminder: z.string().nullish(),
        isPinned: z.boolean().nullish(),
    }),
);

export type TCreateTodoFormSchema = z.infer<typeof CreateTodoFormSchema>;
