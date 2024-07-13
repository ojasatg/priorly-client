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
    type TAllTodosQuerySchema,
    type TDeleteTodoRequestSchema,
    type TDeleteTodoResponseSchema,
    DeleteTodoRequestSchema,
    DeleteTodoResponseSchema,
} from "$schemas";
import { useCreateService } from "$lib/hooks/service.hooks";

const useTodoService = useCreateService();

// Todos
async function createTodo({ requestData, showAlerts }: IPostAPIParams<TCreateTodoRequestSchema>) {
    return useTodoService<TCreateTodoResponseSchema>({
        url: APIs.TODO.CREATE,
        options: {
            method: EAPIRequestMethod.POST,
            body: requestData,
        },
        requestSchema: CreateTodoRequestSchema,
        responseSchema: CreateTodoResponseSchema,
        showAlerts,
    });
}

async function allTodos({ showAlerts, query }: IGetAPIParams<TAllTodosQuerySchema>) {
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

async function deleteTodo({ requestData, showAlerts }: IPostAPIParams<TDeleteTodoRequestSchema>) {
    return useTodoService<TDeleteTodoResponseSchema>({
        url: APIs.TODO.REMOVE,
        options: {
            method: EAPIRequestMethod.DELETE,
            body: requestData,
        },
        requestSchema: DeleteTodoRequestSchema,
        responseSchema: DeleteTodoResponseSchema,
        showAlerts,
    });
}

const todoService = {
    createTodo,
    allTodos,
    deleteTodo,
};

export default todoService;
