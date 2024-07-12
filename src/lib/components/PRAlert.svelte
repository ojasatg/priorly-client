<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { Alert, Button } from "stwui";

    import { COMPONENT_DETAILS_MAP } from "$lib/constants/ui.consts";
    import type { TAlert } from "$lib/types/ui.types";
    import { alerts } from "$lib/stores/AlertStore";

    const dispatchEvent = createEventDispatcher<{ click: { alertId: string } }>();

    $: allAlerts = $alerts as TAlert[];
</script>

<section class="fixed right-4 top-8 z-[9999] flex flex-col gap-2">
    {#each allAlerts as alert (alert.id)}
        <Alert
            class="w-[28rem] border-[1px] bg-surface p-4  {COMPONENT_DETAILS_MAP[alert.type]
                .borderColor} shadow-2xl"
        >
            <span
                class="{COMPONENT_DETAILS_MAP[alert.type].icon} {COMPONENT_DETAILS_MAP[alert.type]
                    .classColor} h-6 w-6"
                slot="leading"
            ></span>
            <Alert.Title class="body-medium" slot="title">{alert.message}</Alert.Title>
            <Alert.Extra slot="extra">
                {#if alert.buttonText}
                    <Button on:click={dispatchEvent("click", { alertId: alert.id })}>
                        <span class={COMPONENT_DETAILS_MAP[alert.type].classColor}
                            >{alert.buttonText}</span
                        >
                    </Button>
                {/if}
            </Alert.Extra>
        </Alert>
    {/each}
</section>
