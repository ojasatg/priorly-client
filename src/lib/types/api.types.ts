import type { FetchOptions } from "ofetch";
import type { ZodSchema } from "zod";

export enum EAPIRequestMethod {
    GET = "GET",
    POST = "POST",
}

export enum EServerResponseCodes {
    OK = 200,
    CREATED = 201,
    UPDATED = 204, // OR DELETED
    ACCEPTED = 202,

    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,

    MOVED = 301,

    INTERNAL_SERVER_ERROR = 500,
}

export enum EServerResponseRescodes {
    SUCCESS = 0,
    ERROR = 1,
    QUEUED = 2,
}

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
