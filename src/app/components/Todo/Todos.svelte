<script lang="ts">
    import type { TTodoItemViewSchema } from "$schemas/view.schemas";
    import TodoItem from "./TodoItem.svelte";

    export let todos: TTodoItemViewSchema[] = [];
</script>

<section>
    <section class="grid grid-cols-3 gap-2">
        {#each todos as todo}
            <TodoItem {todo} />
        {/each}
    </section>
</section>
