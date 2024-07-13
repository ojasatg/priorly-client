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
    DeleteTodoQuerySchema,
    type TEditTodoRequestSchema,
    type TEditTodoQuerySchema,
    TodoDetailsQuerySchema,
    TodoDetailsRequestSchema,
    TodoDetailsResponseSchema,
} from "$schemas";
import { useCreateService } from "$lib/hooks/service.hooks";

const useTodoService = useCreateService();

// Todos
async function all({ showAlerts, queryParams }: IGetAPIParams<TAllTodosQuerySchema>) {
    return useTodoService<TAllTododsResponseSchema>({
        url: APIs.TODO.ALL,
        options: {
            method: EAPIRequestMethod.GET,
            query: queryParams,
        },
        querySchema: AllTodosQuerySchema,
        requestSchema: AllTodosRequestSchema,
        responseSchema: AllTodosResponseSchema,
        showAlerts,
    });
}

async function create({ requestData, showAlerts }: IPostAPIParams<TCreateTodoRequestSchema>) {
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

async function details({ showAlerts, queryParams }: IGetAPIParams<TAllTodosQuerySchema>) {
    return useTodoService<TAllTododsResponseSchema>({
        url: APIs.TODO.DETAILS,
        options: {
            method: EAPIRequestMethod.GET,
            query: queryParams,
        },
        querySchema: TodoDetailsQuerySchema,
        requestSchema: TodoDetailsRequestSchema,
        responseSchema: TodoDetailsResponseSchema,
        showAlerts,
    });
}

async function edit({
    queryParams,
    requestData,
    showAlerts,
}: IPostAPIParams<TEditTodoRequestSchema, TEditTodoQuerySchema>) {
    return useTodoService<TDeleteTodoResponseSchema>({
        url: APIs.TODO.REMOVE,
        options: {
            method: EAPIRequestMethod.PUT,
            query: queryParams,
            body: requestData,
        },
        querySchema: DeleteTodoQuerySchema,
        requestSchema: DeleteTodoRequestSchema,
        responseSchema: DeleteTodoResponseSchema,
        showAlerts,
    });
}

async function remove({ queryParams, showAlerts }: IGetAPIParams<TDeleteTodoRequestSchema>) {
    return useTodoService<TDeleteTodoResponseSchema>({
        url: APIs.TODO.REMOVE,
        options: {
            method: EAPIRequestMethod.DELETE,
            query: queryParams,
        },
        querySchema: DeleteTodoQuerySchema,
        requestSchema: DeleteTodoRequestSchema,
        responseSchema: DeleteTodoResponseSchema,
        showAlerts,
    });
}

const todoService = {
    all,
    create,
    details,
    remove,
    edit,
};

export default todoService;
