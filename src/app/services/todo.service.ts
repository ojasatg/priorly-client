import { PUBLIC_API_URI } from "$env/static/public";
import { ofetch, type FetchOptions } from "ofetch";
import defu from "defu";

import { EAPIRequestMethod, type IPostAPIParams, type TAPISuccess } from "$lib/types/api.types";
// import { handleAuthenticationError } from "$handlers/auth.handler";

import type { TTodoAddRequestSchema } from "$schemas/request.schemas";
import type { TTodoAddResponseSchema } from "$schemas/response.schemas";

import { APIs } from "$lib/constants/api.consts";

async function todoAPIFetch<TData>(
    url: string,
    options = {},
): Promise<TAPISuccess<TData> | undefined> {
    // const baseURL = import.meta.env.API_URI;
    // const baseURL = "http://localhost:3120";
    const baseURL = PUBLIC_API_URI;

    const defaults: FetchOptions = {
        baseURL,

        timeout: 60000,
        // headers: {
        //     "X-Instance-Id": id,
        // },
        async onResponseError({ response }) {
            if (response.status === 401) {
                // handleAPIError(...)
                // if response has any error, show alert here, dont return anything
            }
        },
    };

    const params = defu(options, defaults) as {
        method: EAPIRequestMethod;
        headers: HeadersInit;
        body: BodyInit;
    };

    const response = (await ofetch(url, params)) as TAPISuccess<TData>;

    return response;

    // // In case of downloads the response will contain type field
    // if (response?.type === "application/zip") {
    //     return response;
    // } else if (response?.rescode === SERVER_ERROR_RESPONSE_CODES.SUCCESS) {
    //     return response?.result ?? null;
    // } else {
    //     throw response;
    // }
}

export async function useTodoCreate({ requestData }: IPostAPIParams<TTodoAddRequestSchema>) {
    return todoAPIFetch<TTodoAddResponseSchema>(APIs.TODO.CREATE, {
        method: EAPIRequestMethod.POST,
        body: requestData,
    });
}
