<script lang="ts">
    import { type TSchemaViewTodoItem } from "$schemas/views.schemas";
    import TodoForm from "./TodoForm.svelte";
    import TodoItem from "./TodoItem.svelte";

    export let todos: TSchemaViewTodoItem[];

    const selectedTodo = {} as TSchemaViewTodoItem;
</script>

<section>
    {#each todos as todo}
        <TodoItem {todo} />
    {/each}
    <TodoForm todo={selectedTodo} />
</section>
