<script lang="ts">
    import type { TTodoItemViewSchema } from "$schemas";
    import TodoItem from "./TodoItem.svelte";

    export let todos: TTodoItemViewSchema[];
    export let classNames = "";
</script>

<section>
    <section class="grid grid-cols-3 gap-2 {classNames}">
        {#each todos as todo}
            <TodoItem {todo} on:delete on:toggle on:update />
        {/each}
    </section>
</section>
