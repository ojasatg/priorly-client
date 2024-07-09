<script lang="ts">
    import { Portal, Modal, Button } from "stwui";
    import { createEventDispatcher } from "svelte";

    type TBeforeFunction = (...args: unknown[]) => Promise<boolean> | undefined;

    export let modelValue: boolean;
    export let title;
    export let subtitle = "";
    export let scrim = false;

    export let beforeClose: TBeforeFunction | undefined = undefined;

    const dispatchEvent = createEventDispatcher<{ close: { success: boolean } }>();

    function onClose() {
        if (beforeClose && typeof beforeClose === "function") {
            const abort = beforeClose();
            if (abort) {
                dispatchEvent("close", { success: false });
                return;
            }
        }
        dispatchEvent("close", { success: true });
        modelValue = false;
    }
</script>

<Portal>
    {#if modelValue}<Modal handleClose={onClose}>
            <Modal.Content slot="content">
                <Modal.Content.Header slot="header">
                    <section class="flex flex-col justify-between">
                        <section class="flex items-center justify-between">
                            <p class="title-medium">{title}</p>
                            <Button shape="circle" size="lg" on:click={onClose}>
                                <span slot="icon" class="title-medium i-mdi-close h-8 w-8"> </span>
                            </Button>
                        </section>
                        <p class="body-small">{subtitle}</p>
                    </section>
                </Modal.Content.Header>
                <Modal.Content.Body slot="body">
                    <slot name="content" />
                </Modal.Content.Body>
            </Modal.Content>
            <Modal.Backdrop handleClose={!scrim ? onClose : () => {}} slot="backdrop"
            ></Modal.Backdrop>
        </Modal>
    {/if}
</Portal>
