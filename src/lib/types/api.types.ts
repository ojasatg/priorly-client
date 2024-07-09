import { EServerResponseRescodes } from "$lib/constants/api.consts";
import type { FetchOptions } from "ofetch";
import type { ZodSchema } from "zod";

export type TAPIError = {
    rescode: EServerResponseRescodes.ERROR;
    message: string;
    error: string;
};

export type TAPISuccess<TData = undefined> = {
    rescode: EServerResponseRescodes.SUCCESS | EServerResponseRescodes.QUEUED;
    message: string;
    data?: TData;
};

export interface IPostAPIParams<TRequest, TQuery = undefined> {
    requestData: TRequest;
    query?: TQuery;
    showAlerts?: boolean;
}

export interface IGetAPIParams<TQuery = undefined> {
    query?: TQuery;
    showAlerts?: boolean;
}

export interface IServiceBaseParams {
    url: string;
    options: FetchOptions;
    querySchema: ZodSchema;
    requestSchema: ZodSchema;
    responseSchema: ZodSchema;
    showAlerts?: boolean;
}
