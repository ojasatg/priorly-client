import { PUBLIC_API_URI } from "$env/static/public";

import type { ZodSchema } from "zod";
import { ofetch, type FetchOptions } from "ofetch";
import defu from "defu";

import { EAPIRequestMethod, type IPostAPIParams, type TAPISuccess } from "$types/api.types";
import { APIs } from "$constants/api.consts";
// import { handleAuthenticationError } from "$handlers/auth.handler";

import { TodoAddRequestSchema, type TTodoAddRequestSchema } from "$schemas/request.schemas";
import type { TTodoAddResponseSchema } from "$schemas/response.schemas";
import { alerts } from "$lib/stores/alertStore";

async function todoAPIFetch<TData>(
    url: string,
    options?: FetchOptions,
    schema?: ZodSchema,
): Promise<TAPISuccess<TData> | undefined> {
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
    if (schema && requestBody) {
        try {
            schema.parse(requestBody);
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
export async function useTodoCreate({ requestData }: IPostAPIParams<TTodoAddRequestSchema>) {
    return todoAPIFetch<TTodoAddResponseSchema>(
        APIs.TODO.CREATE,
        {
            method: EAPIRequestMethod.POST,
            body: requestData,
        },
        TodoAddRequestSchema,
    );
}
