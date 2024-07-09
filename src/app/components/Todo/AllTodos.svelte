<script lang="ts">
    import type { TTodoItemSchema } from "$schemas";
    import TodoItem from "./TodoItem.svelte";
    import TodoItemLoader from "$components/loaders/TodoItemLoader.svelte";

    export let awaitingTodosData: Promise<{ todos: TTodoItemSchema[] } | undefined>;
</script>

<section>
    <section class="grid grid-cols-3 gap-2">
        {#await awaitingTodosData}
            {#each Array(3) as id}
                <TodoItemLoader {id} />
            {/each}
        {:then data}
            {#each data?.todos ?? [] as todo}
                <TodoItem {todo} />
            {/each}
        {:catch error}
            <p class="text-error">Something went wrong: {error.message}</p>
        {/await}
    </section>
</section>
