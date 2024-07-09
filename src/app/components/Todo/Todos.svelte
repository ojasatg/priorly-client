<script lang="ts">
    import type { TTodoItemViewSchema } from "$schemas/view.schemas";
    import TodoItem from "./TodoItem.svelte";
    import TodoItemLoader from "$components/loaders/TodoItemLoader.svelte";

    export let todos: Promise<TTodoItemViewSchema[]>;
</script>

<section>
    <section class="grid grid-cols-3 gap-2">
        {#await todos}
            {#each Array(3) as id}
                <TodoItemLoader {id} />
            {/each}
        {:then todos}
            {#each todos as todo}
                <TodoItem {todo} />
            {/each}
        {/await}
    </section>
</section>
