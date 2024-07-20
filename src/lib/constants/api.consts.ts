export enum EServiceMessageCodes {
    REQUEST_VALIDATION_FAILED = "REQUEST_VALIDATION_FAILED",
    QUERY_VALIDATION_FAILED = "QUERY_VALIDATION_FAILED",
    QUERY_WITHOUT_SCHEMA = "QUERY_WITHOUT_SCHEMA",
    RESPONSE_VALIDATION_FAILED = "RESPONSE_VALIDATION_FAILED",
    ERROR_VALIDATION_FAILED = "ERROR_VALIDATION_FAILED",
    EMPTY_RESPONSE = "EMPTY_RESPONSE",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    SERVER_NOT_REACHABLE = "SERVER_NOT_REACHABLE",
    NO_INTERNET = "NO_INTERNET",
    ITEM_NOT_EXISTS = "ITEM_NOT_EXISTS",
    BAD_REQUEST = "BAD_REQUEST",
}

export const SERVICE_MESSAGES: { [key in EServiceMessageCodes]?: string } = {
    REQUEST_VALIDATION_FAILED: "Something is not right! Please check the input(s) again.",
    QUERY_VALIDATION_FAILED: "Something is not right! Please check the input(s) again.",
    QUERY_WITHOUT_SCHEMA: "Query found but query schema not provided.",
    RESPONSE_VALIDATION_FAILED: "Oops! Something went wrong. Please report this issue.",
    ERROR_VALIDATION_FAILED: "Oops! Something went wrong. Please report this issue.",
    SERVER_NOT_REACHABLE: "Can't connect to the server right now. Please try again after sometime.",
    NO_INTERNET: "Can't connect to the server right now. Please check your internet connection",
    ITEM_NOT_EXISTS: "Requested item does not exist",
    INTERNAL_SERVER_ERROR: "Some error occured from our end. Please try again after sometime",
    BAD_REQUEST: "Bad request, please provide relevant details",
};

export enum EAPIRequestMethod {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT",
}

export enum EServerResponseCodes {
    OK = 200,
    CREATED = 201,
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
