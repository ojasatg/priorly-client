import { PUBLIC_API_URI } from "$env/static/public";
import { ofetch, type FetchOptions } from "ofetch";
import defu from "defu";

import {
    EAPIRequestMethod,
    type IPostAPIParams,
    type IServiceBaseParams,
    type TAPISuccess,
} from "$lib/types/api.types";
import { APIs } from "$constants/api.consts";
// import { handleAuthenticationError } from "$handlers/auth.handler";

import { TodoAddRequestSchema, type TTodoAddRequestSchema } from "$schemas/request.schemas";
import { TodoAddResponseSchema, type TTodoAddResponseSchema } from "$schemas/response.schemas";
import { alerts } from "$lib/stores/alertStore";

async function todoServiceBase<TData>({
    url,
    options,
    requestSchema,
}: IServiceBaseParams): Promise<TAPISuccess<TData> | undefined> {
    const baseURL = PUBLIC_API_URI;
    const defaults: FetchOptions = {
        baseURL,
        timeout: 60000,
        // headers: {
        //     "X-Instance-Id": id,
        // },
        async onResponseError({ response }) {
            if (response.status === 401) {
                // handleAuthenticationError(...)
                // if response has any error, show alert here, dont return anything
            } else if (response.status === 500) {
                throw new Error(response._data.message);
            }
        },
    };

    const requestBody = options?.body;
    if (requestSchema && requestBody) {
        try {
            requestSchema.parse(requestBody);
        } catch (error) {
            console.error(error);
            alerts.error("Something is not right! Please check the input(s) again.");
            throw new Error("Request validation failed");
        }
    }

    const params = defu(options, defaults) as {
        method: EAPIRequestMethod;
        headers: HeadersInit;
        body: BodyInit;
    };

    const response = (await ofetch(url, params)) as TAPISuccess<TData>;

    return response;
}

// Todos
async function createTodo({ requestData }: IPostAPIParams<TTodoAddRequestSchema>) {
    return todoServiceBase<TTodoAddResponseSchema>({
        url: APIs.TODO.CREATE,
        options: {
            method: EAPIRequestMethod.POST,
            body: requestData,
        },
        requestSchema: TodoAddRequestSchema,
        responseSchema: TodoAddResponseSchema,
    });
}

const todoService = {
    createTodo,
};

export default todoService;
