import type { IDropdownItem } from "$lib/types/ui.types";
import type { TTodoItemViewSchema } from "$schemas";

export enum ETodoItemMenuKeys {
    ADD_LABEL = "add_label",
    EDIT_PRIORIY = "edit_priority",
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
        key: ETodoItemMenuKeys.EDIT_PRIORIY,
        label: "Edit priority",
        icon: "i-mdi-sort-bool-descending",
    },
    {
        key: ETodoItemMenuKeys.MAKE_COPY,
        label: "Make a copy",
        icon: "i-mdi-content-copy",
    },
];

export enum ETodoType {
    PINNED = "pinned",
    DONE = "done",
    PENDING = "pending",
}

export enum ETodoFilter {
    isDone = "isDone",
    isPinned = "isPinned",
}

export const TODO_TYPE_TABS = [
    {
        href: `#${ETodoType.PINNED}`,
        title: "Pinned",
        icon: "i-mdi-pin",
    },
    {
        href: `#${ETodoType.PENDING}`,
        title: "Pending",
        icon: "i-mdi-clock-time-six-outline",
    },
    {
        href: `#${ETodoType.DONE}`,
        title: "Done",
        icon: "i-mdi-checkbox-marked-circle-outline",
    },
];

export enum ETodoToggleType {
    PIN,
    DONE,
    SELECT,
}

export enum ETodoFormType {
    ADD,
    EDIT,
}

export enum ETodoBulkOperation {
    PIN,
    DONE,
    DELETE,
    NOT_DONE,
    UNPIN,
}
