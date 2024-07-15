<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { Button, Input } from "stwui";
    import { tooltip } from "stwui/actions";

    export let refreshing;
    export let todoSearchVal = "";

    const dispatchEvent = createEventDispatcher<{
        refresh: null;
        addTodo: null;
    }>();
</script>

<section
    class="border-b-1 gradient-surface z-10 my-4 mb-8 flex items-center gap-2 border-b-2 border-gray-200 px-4 pb-4"
>
    <p class="title-medium">Todos</p>
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

    <Input
        name="todo-search"
        placeholder="Search todo..."
        bind:value={todoSearchVal}
        type="text"
        allowClear
        class="ml-auto"
    />
</section>
