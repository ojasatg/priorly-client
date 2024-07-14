<script lang="ts">
    import { Portal, Modal, Button } from "stwui";
    import { createEventDispatcher } from "svelte";

    export let modelValue: boolean;
    export let title;
    export let subtitle = "";
    export let scrim = false;
    export let showCloseBtn = false;

    const dispatchEvent = createEventDispatcher<{ close: null; iconClick: null }>();

    function onClose() {
        const shouldContinue = dispatchEvent("close", null, { cancelable: true });
        // After dispatch, run beforeClose function. Call event.preventDefault() to abort the further execution.
        if (shouldContinue) {
            // only executes when event.preventDefault() is not called
            modelValue = false;
        }
    }
</script>

<Portal>
    {#if modelValue}<Modal handleClose={onClose}>
            <Modal.Content slot="content">
                <Modal.Content.Header slot="header">
                    <section class="flex flex-col justify-between">
                        <section class="flex items-center justify-between">
                            <p class="title-medium">{title}</p>
                            {#if showCloseBtn}
                                <Button shape="circle" size="lg" on:click={onClose}>
                                    <span slot="icon" class="title-medium i-mdi-close h-8 w-8" />
                                </Button>
                            {/if}
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
