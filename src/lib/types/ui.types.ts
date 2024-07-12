export type TComponentType = "success" | "info" | "warn" | "error";

export type TAlert = {
    id: string;
    visible: boolean;
    type: TComponentType;
    message?: string;
    buttonText?: string;
    duration?: number;
};

export type T = ((e: CustomEvent<unknown>) => void) | null | undefined;

export interface IDropdownItem<TKeyString> {
    key: TKeyString;
    icon?: string;
    label: string;
    children?: IDropdownItem<TKeyString>[];
    onClick?: () => void;
}
