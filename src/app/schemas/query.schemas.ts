import { z } from "zod";

export const AllTodosQuerySchema = z.object({});

export type TAllTodosQuerySchema = z.infer<typeof AllTodosQuerySchema>;
