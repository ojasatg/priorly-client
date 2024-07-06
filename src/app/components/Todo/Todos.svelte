<script lang="ts">
    import { type TTodoResponseSchema } from "$schemas/response.schemas";
    import TodoForm from "./TodoForm.svelte";
    import TodoItem from "./TodoItem.svelte";

    export let todos: TTodoResponseSchema[];

    const selectedTodo = {} as TTodoResponseSchema;
</script>

<section>
    <section class="grid grid-cols-3 gap-2">
        {#each todos as todo}
            <TodoItem {todo} />
        {/each}
    </section>
    <TodoForm todo={selectedTodo} />
</section>
