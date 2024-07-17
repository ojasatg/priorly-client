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
    <Button size="lg" shape="circle">
        <span slot="icon" class="title-large i-mdi-menu text-gray-500" />
    </Button>

    <span class="headline-medium i-mdi-document ml-12 text-yellow-400" />
    <p class="title-medium text-gray-600">Todos</p>
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
            <span slot="icon" class="i-mdi-refresh h-16 w-16 text-gray-600" />
        </Button>
    </span>

    <Input
        name="todo-search"
        placeholder="Search todos..."
        bind:value={todoSearchVal}
        type="text"
        allowClear
        class="ml-8 w-[32rem]"
    />
</section>
