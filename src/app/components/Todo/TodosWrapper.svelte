<script lang="ts">
    import type { TTodoItemViewSchema } from "$schemas";
    import TodoItem from "./TodoItem.svelte";

    export let todos: TTodoItemViewSchema[];
</script>

<section>
    <section class="grid grid-cols-3 gap-2">
        {#each todos as todo}
            <TodoItem {todo} on:delete />
        {/each}
    </section>
</section>
