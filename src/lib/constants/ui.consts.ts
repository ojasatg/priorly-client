import type { TComponentType } from "$lib/types/ui.types";

export const COMPONENT_DETAILS_MAP: Record<
    TComponentType,
    { icon: string; classColor: string; buttonType: "primary" | "danger"; borderColor: string }
> = {
    success: {
        icon: "i-mdi-check-circle",
        classColor: "text-success",
        borderColor: "border-success",
        buttonType: "primary",
    },
    info: {
        icon: "i-mdi-information",
        classColor: "text-primary",
        borderColor: "border-primary",
        buttonType: "primary",
    },
    warn: {
        icon: "i-mdi-alert-circle",
        classColor: "text-warning",
        borderColor: "border-warning",
        buttonType: "danger",
    },
    error: {
        icon: "i-mdi-alert-decagram",
        classColor: "text-error",
        borderColor: "border-error",
        buttonType: "danger",
    },
};