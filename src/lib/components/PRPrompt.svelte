<script lang="ts">
    import { Portal, Modal, Button } from "stwui";
    import { createEventDispatcher } from "svelte";

    import type { TComponentType } from "$lib/types/ui.types";
    import { COMPONENT_DETAILS_MAP } from "$lib/constants/ui.consts";

    export let modelValue = false;
    export let title: string;
    export let message: string = "";
    export let note = "";
    export let type: TComponentType;
    export let submitText = "";
    export let cancelText = "";
    export let scrim = false;

    const dispatchEvent = createEventDispatcher<{
        submit: null;
        cancel: null;
    }>();

    $: text_color_class = COMPONENT_DETAILS_MAP[type].classColor;
    $: title_icon = COMPONENT_DETAILS_MAP[type].icon;
    $: primary_button_type = COMPONENT_DETAILS_MAP[type].buttonType;

    function onSubmit() {
        const shouldContinue = dispatchEvent("submit", null, { cancelable: true });
        if (shouldContinue) {
            modelValue = false;
        }
    }

    function onCancel() {
        const shouldContinue = dispatchEvent("cancel", null, { cancelable: true });
        if (shouldContinue) {
            modelValue = false;
        }
    }
</script>

<Portal>
    {#if modelValue}
        <Modal handleClose={onCancel}>
            <Modal.Content slot="content" class="mt-48 grid gap-4 p-4">
                <section class="title-medium flex items-center gap-2">
                    <span class="{title_icon} {text_color_class}"></span>
                    <p class="title-small">{title}</p>
                </section>

                <section class="grid gap-1 p-4">
                    <p class="body-medium">{message}</p>

                    <section class="mt-1 flex items-center gap-1 {text_color_class} ">
                        <span class="i-mdi-information-outline {text_color_class}"></span>
                        <p class="body-small">{note}</p>
                    </section>
                </section>

                <section class="ml-auto w-fit">
                    <Button on:click={onCancel} size="sm" class="text-gray-600">
                        <span class="body-medium">{cancelText ?? "Cancel"}</span>
                    </Button>
                    <Button type={primary_button_type} on:click={onSubmit} size="sm">
                        <span class="body-medium">{submitText ?? "OK"}</span>
                    </Button>
                </section>
            </Modal.Content>
            <Modal.Backdrop handleClose={!scrim ? onCancel : () => {}} slot="backdrop" />
        </Modal>
    {/if}
</Portal>
