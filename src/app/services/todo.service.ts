import type { IGetAPIParams, IPostAPIParams } from "$lib/types/api.types";
import { EAPIRequestMethod } from "$lib/constants/api.consts";
import { APIs } from "$constants/api.consts";

import {
    CreateTodoRequestSchema,
    type TCreateTodoRequestSchema,
    CreateTodoResponseSchema,
    type TCreateTodoResponseSchema,
    type TAllTododsResponseSchema,
    AllTodosRequestSchema,
    AllTodosResponseSchema,
    AllTodosQuerySchema,
} from "$schemas";
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

async function allTodos({ showAlerts, query }: IGetAPIParams) {
    return useTodoService<TAllTododsResponseSchema>({
        url: APIs.TODO.ALL,
        options: {
            method: EAPIRequestMethod.GET,
            query,
        },
        querySchema: AllTodosQuerySchema,
        requestSchema: AllTodosRequestSchema,
        responseSchema: AllTodosResponseSchema,
        showAlerts,
    });
}

const todoService = {
    createTodo,
    allTodos,
};

export default todoService;
