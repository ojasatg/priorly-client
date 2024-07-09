import { EServiceMessageCodes, SERVICE_MESSAGES } from "$lib/constants/api.consts";

export function generateServiceMessages(code: EServiceMessageCodes) {
    return `${SERVICE_MESSAGES[code]} Code: ${code}`;
}

export function mockAPIResponse<TData>(data: TData, ms: number) {
    return new Promise<TData>((resolve) => {
        setTimeout(() => resolve(data), ms);
    });
}
