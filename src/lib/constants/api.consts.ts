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
