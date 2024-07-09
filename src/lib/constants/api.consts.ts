export enum EServiceMessageCodes {
    REQUEST_VALIDATION_FAILED = "REQUEST_VALIDATION_FAILED",
    QUERY_VALIDATION_FAILED = "QUERY_VALIDATION_FAILED",
    RESPONSE_VALIDATION_FAILED = "RESPONSE_VALIDATION_FAILED",
    ERROR_VALIDATION_FAILED = "ERROR_VALIDATION_FAILED",
    EMPTY_RESPONSE = "EMPTY_RESPONSE",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export const SERVICE_MESSAGES: { [key in EServiceMessageCodes]?: string } = {
    REQUEST_VALIDATION_FAILED: "Something is not right! Please check the input(s) again.",
    QUERY_VALIDATION_FAILED: "Something is not right! Please check the input(s) again.",
    RESPONSE_VALIDATION_FAILED: "Oops! Something went wrong. Please report this issue.",
    ERROR_VALIDATION_FAILED: "Oops! Something went wrong. Please report this issue.",
};

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
