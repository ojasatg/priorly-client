import type { IDropdownItem } from "$lib/types/ui.types";
import type { TTodoItemViewSchema } from "$schemas";

export enum ETodoItemMenuKeys {
    ADD_LABEL = "add_label",
    ADD_PRIORIY = "add_priority",
    MAKE_COPY = "make_copy",
    CONVERT_TO_NOTES = "convert_to_notes",
}

export const TODO_ITEM_MENU_ITEMS: IDropdownItem<ETodoItemMenuKeys, TTodoItemViewSchema>[] = [
    {
        key: ETodoItemMenuKeys.ADD_LABEL,
        label: "Add a label",
        icon: "i-mdi-label",
    },
    {
        key: ETodoItemMenuKeys.ADD_PRIORIY,
        label: "Add priority",
        icon: "i-mdi-sort-bool-descending",
    },
    {
        key: ETodoItemMenuKeys.MAKE_COPY,
        label: "Make a copy",
        icon: "i-mdi-content-copy",
    },
    {
        key: ETodoItemMenuKeys.CONVERT_TO_NOTES,
        label: "Convert to notes",
        icon: "i-mdi-note-text-outline",
    },
];

export enum ETodoToggleType {
    PIN,
    DONE,
    SELECT,
}
