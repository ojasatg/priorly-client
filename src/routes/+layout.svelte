<script lang="ts">
    import "../app.scss";

    import PRAlert from "$lib/components/PRAlert.svelte";
    import { alerts } from "$lib/stores/AlertStore";
    import _ from "lodash";

    // function showAlerts() {
    //     alerts.success("success!", 3000);
    //     alerts.info("info!", 3000);
    //     alerts.warning("warning!", 3000);
    //     alerts.error("error!", 3000);
    // }

    // function showActionAlert() {
    //     alerts.showAlert({
    //         type: "success",
    //         message: "Action alert",
    //         duration: 5000,
    //         buttonText: "Click Me!",
    //     });
    // }

    function doAlertAction(event: CustomEvent<{ alertId: string }>) {
        alert(event.detail.alertId);
    }
</script>

<section class="app">
    {#if !_.isEmpty($alerts)}
        <PRAlert on:click={doAlertAction} />
    {/if}

    <!-- Check styles at the bottom of this component -->
    <main>
        <slot />
    </main>
</section>

<!-- <section class="fixed bottom-48 left-48">
    <button class="mt-8 w-fit bg-primary p-2 text-surface" on:click={showAlerts}>
        Show Alert
    </button>
    <button class="mt-8 w-fit bg-primary p-2 text-surface" on:click={showActionAlert}>
        Show Action Alert
    </button>
</section> -->

<style>
    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
    }
</style>
