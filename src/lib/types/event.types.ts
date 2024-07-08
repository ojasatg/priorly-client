export type THTMLDivInputEvent = Event & { currentTarget: EventTarget & HTMLDivElement };
export type THTMLInputEvent = Event & { currentTarget: EventTarget & HTMLInputElement };
export type THTMLTextAreaEvent = Event & { currentTarget: EventTarget & HTMLTextAreaElement };

export type TButtonReturnFunction = ((e: CustomEvent<unknown>) => void) | null | undefined;
