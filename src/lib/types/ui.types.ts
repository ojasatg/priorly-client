import type { TButtonReturnFunction } from "./event.types";

export type TComponentType = "success" | "info" | "warn" | "error";

export type TAlert = {
    id: string;
    visible: boolean;
    type: TComponentType;
    message?: string;
    buttonText?: string;
    buttonAction?: () => TButtonReturnFunction;
    duration?: number;
};

export type T = ((e: CustomEvent<unknown>) => void) | null | undefined;
