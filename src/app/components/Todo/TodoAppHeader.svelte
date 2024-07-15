<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { Button } from "stwui";
    import { tooltip } from "stwui/actions";

    export let refreshing;

    const dispatchEvent = createEventDispatcher<{
        refresh: null;
        addTodo: null;
    }>();
</script>

<section class="mb-4 flex items-center gap-2">
    <p class="title-medium">My Todos</p>
    <span
        use:tooltip={{
            placement: "top",
            content: "Refresh",
            arrow: false,
            animation: "scale",
        }}
        class="w-fit"
    >
        <Button
            shape="circle"
            size="lg"
            on:click={() => dispatchEvent("refresh")}
            disabled={refreshing}
            loading={refreshing}
        >
            <span slot="icon" class="i-mdi-refresh h-16 w-16" />
        </Button>
    </span>
</section>
