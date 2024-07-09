import type { IPostAPIParams } from "$lib/types/api.types";
import { EAPIRequestMethod } from "$lib/constants/api.consts";
import { APIs } from "$constants/api.consts";

import { CreateTodoRequestSchema, type TCreateTodoRequestSchema } from "$schemas/request.schemas";
import {
    CreateTodoResponseSchema,
    type TCreateTodoResponseSchema,
} from "$schemas/response.schemas";
import { useCreateService } from "$lib/hooks/service.hooks";
import { z } from "zod";

const useTodoService = useCreateService();

// Todos
async function createTodo({ requestData, showAlerts }: IPostAPIParams<TCreateTodoRequestSchema>) {
    return useTodoService<TCreateTodoResponseSchema>({
        url: APIs.TODO.CREATE,
        options: {
            method: EAPIRequestMethod.POST,
            body: requestData,
        },
        querySchema: z.object({}), // empty for this service
        requestSchema: CreateTodoRequestSchema,
        responseSchema: CreateTodoResponseSchema,
        showAlerts,
    });
}

const todoService = {
    createTodo,
};

export default todoService;
