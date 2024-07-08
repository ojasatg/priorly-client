<script lang="ts">
    import { Alert, Button } from "stwui";

    import { COMPONENT_DETAILS_MAP } from "$lib/constants/ui.consts";
    import type { TAlert } from "$lib/types/ui.types";
    import { alerts } from "$lib/stores/alertStore";

    // $: text_color_class = COMPONENT_DETAILS_MAP.success.classColor;
    // $: alert_icon = COMPONENT_DETAILS_MAP.success.icon;
    // $: border_color_class = COMPONENT_DETAILS_MAP.success.borderColor;

    $: allAlerts = $alerts as TAlert[];
</script>

<section class="fixed right-4 top-8 z-[9999] flex flex-col gap-2">
    {#each allAlerts as alert (alert.id)}
        <section class="alert-appear">
            <Alert
                class="w-[28rem] border-[1px] bg-surface p-4 {COMPONENT_DETAILS_MAP[alert.type]
                    .borderColor} shadow-2xl"
            >
                <span
                    class="{COMPONENT_DETAILS_MAP[alert.type].icon} {COMPONENT_DETAILS_MAP[
                        alert.type
                    ].classColor} h-6 w-6"
                    slot="leading"
                ></span>
                <Alert.Title class="body-medium" slot="title">{alert.message}</Alert.Title>
                <Alert.Extra slot="extra">
                    {#if alert.buttonText}
                        <Button on:click={alert.buttonAction?.()}>
                            <span class={COMPONENT_DETAILS_MAP[alert.type].classColor}
                                >{alert.buttonText}</span
                            >
                        </Button>
                    {/if}
                </Alert.Extra>
            </Alert>
        </section>{/each}
</section>

<style lang="scss">
    @keyframes smooth-appear {
        from {
            right: 0%;
            opacity: 0;
        }
        to {
            right: 1%;
            opacity: 1;
        }
    }

    @keyframes smooth-disappear {
        from {
            right: 1%;
            opacity: 1;
        }
        to {
            right: 0%;
            opacity: 0;
        }
    }

    .alert-appear {
        animation: smooth-appear 0.3s ease forwards;
    }

    .alert-disappear {
        animation: smooth-disappear 0.3s ease forwards;
    }
</style>
