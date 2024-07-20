import {
    TodoBulkOperationRequestSchema,
    type TTodoBulkOperationRequestSchema,
} from "./../schemas/request.schemas";
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
    EditTodoQuerySchema,
    EditTodoRequestSchema,
    EditTodoResponseSchema,
    type TEditTodoResponseSchema,
    TodoBulkOperationQuerySchema,
    TodoBulkOperationResponseSchema,
    type TTodoBulkOperationResponseSchema,
} from "$schemas";
import { useCreateService } from "$lib/hooks/service.hooks";

const useTodoService = useCreateService();

async function all({ showAlerts, queryParams }: IGetAPIParams<TAllTodosQuerySchema>) {
    return useTodoService<TAllTododsResponseSchema>({
        url: APIs.TODO.ALL,
        options: {
            method: EAPIRequestMethod.GET,
            query: queryParams ?? {},
        },
        querySchema: AllTodosQuerySchema,
        requestSchema: AllTodosRequestSchema,
        responseSchema: AllTodosResponseSchema,
        showAlerts,
    });
}

async function allDeleted({ showAlerts, queryParams }: IGetAPIParams<TAllTodosQuerySchema>) {
    return useTodoService<TAllTododsResponseSchema>({
        url: APIs.TODO.DELETED,
        options: {
            method: EAPIRequestMethod.GET,
            query: queryParams ?? {},
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
            query: queryParams ?? {},
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
    return useTodoService<TEditTodoResponseSchema>({
        url: APIs.TODO.EDIT,
        options: {
            method: EAPIRequestMethod.PUT,
            query: queryParams,
            body: requestData,
        },
        querySchema: EditTodoQuerySchema,
        requestSchema: EditTodoRequestSchema,
        responseSchema: EditTodoResponseSchema,
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

async function bulk({ requestData, showAlerts }: IPostAPIParams<TTodoBulkOperationRequestSchema>) {
    return useTodoService<TTodoBulkOperationResponseSchema>({
        url: APIs.TODO.BULK,
        options: {
            method: EAPIRequestMethod.DELETE,
            body: requestData,
        },
        querySchema: TodoBulkOperationQuerySchema,
        requestSchema: TodoBulkOperationRequestSchema,
        responseSchema: TodoBulkOperationResponseSchema,
        showAlerts,
    });
}

const todoService = {
    all,
    create,
    details,
    remove,
    edit,
    bulk,
    allDeleted,
};

export default todoService;
