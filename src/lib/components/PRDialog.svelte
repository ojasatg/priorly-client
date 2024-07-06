<script lang="ts">
    import { Portal, Modal, Button } from "stwui";
    import { createEventDispatcher } from "svelte";

    type TBeforeFunction = (...args: unknown[]) => Promise<boolean | undefined> | undefined;

    export let modelValue;
    export let title;
    export let subtitle;

    export let beforeClose: TBeforeFunction;

    const dispatchClose = createEventDispatcher<{ close: { success: boolean } }>();

    function onClose() {
        if (beforeClose && typeof beforeClose === "function") {
            const abort = beforeClose();
            if (abort) {
                dispatchClose("close", { success: false });
                return;
            }
        }
        dispatchClose("close", { success: true });
        modelValue = false;
    }
</script>

<Portal class="bg-surface ">
    {#if modelValue}<Modal handleClose={onClose}>
            <Modal.Content slot="content">
                <Modal.Content.Header slot="header">
                    <section class="flex flex-col justify-between">
                        <section class="flex items-center justify-between">
                            <p class="title-medium">{title}</p>
                            <Button shape="circle" on:click={onClose}>
                                <span slot="icon" class="i-mdi-close title-medium"> </span>
                            </Button>
                        </section>
                        <p class="body-small">{subtitle}</p>
                    </section>
                </Modal.Content.Header>
                <Modal.Content.Body slot="body">
                    <slot name="content" />
                </Modal.Content.Body>
            </Modal.Content>
        </Modal>
    {/if}
</Portal>
