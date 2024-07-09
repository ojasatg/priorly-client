<script lang="ts">
    import { Portal, Modal, Button } from "stwui";
    import { createEventDispatcher } from "svelte";

    import type { TComponentType } from "$lib/types/ui.types";
    import { COMPONENT_DETAILS_MAP } from "$lib/constants/ui.consts";

    type TBeforeFunction = (...args: unknown[]) => Promise<boolean> | undefined;

    export let modelValue = false;
    export let title;
    export let message;
    export let note = "";
    export let type: TComponentType;
    export let submitText = "";
    export let cancelText = "";
    export let scrim = false;

    export let beforeSubmit: TBeforeFunction | undefined = undefined;
    export let beforeCancel: TBeforeFunction | undefined = undefined;

    const dispatcEvent = createEventDispatcher<{
        submit: { success: boolean };
        cancel: { success: boolean };
    }>();

    $: text_color_class = COMPONENT_DETAILS_MAP[type].classColor;
    $: title_icon = COMPONENT_DETAILS_MAP[type].icon;
    $: primary_button_type = COMPONENT_DETAILS_MAP[type].buttonType;

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
                        <span class={title_icon}></span>
                        <p>{title}</p>
                    </section>
                </Modal.Content.Header>
                <Modal.Content.Body slot="body">
                    <section class="body-medium">
                        {message}
                    </section>
                    <section class="body-small flex items-center gap-2 {text_color_class}">
                        <span class="i-mdi-information-outline {text_color_class}"></span>
                        <p>{note}</p>
                    </section>
                </Modal.Content.Body>
                <Modal.Content.Footer slot="footer">
                    <section class="ml-auto w-fit">
                        <Button on:click={onCancel} size="sm" class="text-gray-600">
                            <span class="body-medium">{cancelText ?? "Cancel"}</span>
                        </Button>
                        <Button type={primary_button_type} on:click={onSubmit} size="sm">
                            <span class="body-medium">{submitText ?? "OK"}</span>
                        </Button>
                    </section>
                </Modal.Content.Footer>
            </Modal.Content>
            <Modal.Backdrop handleClose={!scrim ? onCancel : () => {}} slot="backdrop" />
        </Modal>
    {/if}
</Portal>
