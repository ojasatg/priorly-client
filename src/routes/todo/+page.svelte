<script lang="ts">
    import { type TSchemaViewTodoItem } from "$schemas/views.schemas";
    import Todos from "$components/Todo/Todos.svelte";

    function getTimestamp() {
        return new Date().getTime() / 1000;
    }

    const todos: TSchemaViewTodoItem[] = [
        {
            id: "abc",
            title: "Complete assignment",
            description: "Finish the project by the end of the week",
            done: false,
            created: getTimestamp(),
            updated: getTimestamp(),
            deadline: getTimestamp(),
        },
        {
            id: "pqr",
            title: "Buy groceries",
            description: "Pick up vegetables and fruits from the market",
            done: false,
            created: getTimestamp(),
            updated: getTimestamp(),
            deadline: getTimestamp(),
        },
        {
            id: "xyz",
            title: "Call client",
            description: "Discuss the new project requirements",
            done: true,
            created: getTimestamp(),
            updated: getTimestamp(),
            deadline: getTimestamp(),
        },
    ];
</script>

<section>
    <Todos {todos} />
</section>
