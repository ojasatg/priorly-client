import { EServiceMessageCodes, SERVICE_MESSAGES } from "$lib/constants/api.consts";

export function generateServiceMessages(code: EServiceMessageCodes) {
    return `${SERVICE_MESSAGES[code]} Code: ${code}`;
}
