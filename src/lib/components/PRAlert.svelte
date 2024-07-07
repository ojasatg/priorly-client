<script lang="ts">
    import { Alert, Button } from "stwui";

    import { COMPONENT_DETAILS_MAP } from "$lib/constants/ui.consts";

    // const { type, message, hasButton, buttonText } = alertStore;

    let alert_disappear = "";
    setTimeout(() => {
        alert_disappear = "alert-disappear";
    }, 4000);

    $: text_color_class = COMPONENT_DETAILS_MAP.success.classColor;
    $: alert_icon = COMPONENT_DETAILS_MAP.success.icon;
    $: border_color_class = COMPONENT_DETAILS_MAP.success.borderColor;
</script>

<section class="alert {alert_disappear} ">
    <Alert class="w-[32rem] border-[1px] bg-surface p-4 {border_color_class} shadow-2xl">
        <span class="{alert_icon} {text_color_class} h-6 w-6" slot="leading"></span>
        <Alert.Title class="body-medium" slot="title">Good Job</Alert.Title>
        <!-- {#if hasButton}
            <Alert.Extra slot="extra">
                <Button on:click={alertStore.buttonAction?.()}>
                    <span class={text_color_class}>{buttonText}</span>
                </Button>
            </Alert.Extra>
        {/if} -->
    </Alert>
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

    .alert {
        position: fixed;
        animation: smooth-appear 0.3s ease forwards;
        top: 2%;
        z-index: 9999;
    }

    .alert-disappear {
        animation: smooth-disappear 0.3s ease forwards;
    }
</style>
