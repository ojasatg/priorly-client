<script>
    import "./styles.css";
    import "../app.scss";

    import PRAlert from "$lib/components/PRAlert.svelte";
    import { alerts } from "$lib/stores/alertStore";
    import _ from "lodash";

    function showAlerts() {
        alerts.success("success!", 3000);
        alerts.info("info!", 3000);
        alerts.warning("warning!", 3000);
        alerts.error("error!", 3000);
    }

    function showActionAlert() {
        alerts.showAlert({
            type: "success",
            message: "Action alert",
            duration: 5000,
            buttonText: "Click Me!",

            buttonAction: () => {
                alert("Button Action clicked");
            },
        });
    }
</script>

<section class="app">
    {#if !_.isEmpty($alerts)}
        <PRAlert />
    {/if}
    <!-- <Header /> -->

    <main>
        <slot />
        <button class="mt-8 w-fit bg-primary p-2 text-surface" on:click={showAlerts}>
            Show Alert
        </button>
        <button class="mt-8 w-fit bg-primary p-2 text-surface" on:click={showActionAlert}>
            Show Action Alert
        </button>
    </main>

    <footer>
        <p class="text-wrap text-center text-3xl">
            visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit
        </p>
    </footer>
</section>

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
        padding: 1rem;
        width: 100%;
        max-width: 64rem;
        margin: 0 auto;
        box-sizing: border-box;
    }

    footer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 12px;
    }

    footer a {
        font-weight: bold;
    }

    @media (min-width: 480px) {
        footer {
            padding: 12px 0;
        }
    }
</style>
