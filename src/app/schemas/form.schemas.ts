import { z } from "zod";
import { GenericTodoItemSchema } from "./generic.schema";

export const CreateTodoFormSchema = GenericTodoItemSchema.merge(
    z.object({
        deadline: z.string().nullish(),
        reminder: z.string().nullish(),
    }),
);

export type TCreateTodoFormSchema = z.infer<typeof CreateTodoFormSchema>;
