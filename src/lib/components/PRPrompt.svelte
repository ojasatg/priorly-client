<script lang="ts">
    import { Portal, Modal, Button } from "stwui";
    import { createEventDispatcher } from "svelte";

    type TBeforeFunction = (...args: unknown[]) => Promise<boolean | undefined> | undefined;
    type TPromptType = "success" | "info" | "warning" | "error";

    const PROMPT_ICON_MAP: Record<TPromptType, string> = {};

    export let modelValue = false;
    export let title;
    export let message;
    export let note = "";
    export let type: TPromptType;
    export let submitText = "";
    export let cancelText = "";

    export let beforeSubmit: TBeforeFunction;
    export let beforeCancel: TBeforeFunction;

    const dispatcEvent = createEventDispatcher<{
        submit: { success: boolean };
        cancel: { success: boolean };
    }>();

    $: text_color_class = `text-${type}`;
    $: title_icon = PROMPT_ICON_MAP[type];

    function onSubmit() {
        if (beforeSubmit && typeof beforeSubmit === "function") {
            const abort = beforeSubmit();
            if (abort) {
                dispatcEvent("submit", { success: false });
                return;
            }
        }
        dispatcEvent("submit", { success: true });
        modelValue = false;
    }

    function onCancel() {
        if (beforeCancel && typeof beforeCancel === "function") {
            const abort = beforeCancel();
            if (abort) {
                dispatcEvent("cancel", { success: false });
                return;
            }
        }
        dispatcEvent("cancel", { success: true });
        modelValue = false;
    }
</script>

<Portal>
    {#if modelValue}
        <Modal handleClose={onCancel}>
            <Modal.Content slot="content">
                <Modal.Content.Header slot="header">
                    <section class="title-medium flex items-center gap-2 {title_icon}">
                        <span class="i-mdi-info-outline"></span>
                        <p>{title}</p>
                    </section>
                </Modal.Content.Header>
                <Modal.Content.Body slot="body">
                    <section class="body-medium">
                        {message}
                    </section>
                    <section class="body-small flex items-center gap-2 {text_color_class}">
                        <span class="i-mdi-info-outline"></span>
                        <p>{note}</p>
                    </section>
                </Modal.Content.Body>
                <Modal.Content.Footer slot="footer">
                    <section class="ml-auto w-fit">
                        <Button on:click={onCancel} size="sm" class="text-gray-600">
                            <span class="body-medium">{cancelText ?? "Cancel"}</span>
                        </Button>
                        <Button {type} on:click={onSubmit} size="sm">
                            <span class="body-medium">{submitText ?? "OK"}</span>
                        </Button>
                    </section>
                </Modal.Content.Footer>
            </Modal.Content>
        </Modal>
    {/if}
</Portal>
