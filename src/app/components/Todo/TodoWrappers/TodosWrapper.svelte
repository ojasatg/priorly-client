<script lang="ts">
    import type { TTodoItemViewSchema } from "$schemas";
    import TodoItemCard from "../TodoItemCard.svelte";

    export let todos: TTodoItemViewSchema[];
    export let _class = "";
</script>

<section class="grid grid-cols-3 gap-2 {_class}">
    {#each todos as todo}
        <TodoItemCard bind:todo on:delete on:toggle on:update />
    {/each}
</section>
