<script>
    import "./styles.css";
    import "../app.scss";

    import PRAlert from "$lib/components/PRAlert.svelte";
    import { useAlertStore } from "$lib/stores/alertStore";

    const alert = useAlertStore();
</script>

<section class="app">
    {#if $alert}
        <PRAlert />
    {/if}
    <!-- <Header /> -->

    <main>
        <slot />
        <button class="mt-8 w-fit bg-primary p-2 text-surface" on:click={() => alert.showAlert()}>
            Show Alert
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
