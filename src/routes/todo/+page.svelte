<script lang="ts">
    import { type TSchemaViewTodoItem } from "$schemas/views.schemas";
    import Todos from "$components/Todo/Todos.svelte";

    import { getCurrentTimeStamp } from "$lib/utils/datetime.utils";

    const todos: TSchemaViewTodoItem[] = [
        {
            id: "abc",
            title: "Complete assignment",
            description: "Finish the project by the end of the week",
            done: false,
            created: getCurrentTimeStamp(),
            updated: getCurrentTimeStamp(),
            deadline: getCurrentTimeStamp(),
        },
        {
            id: "pqr",
            title: "Buy groceries",
            description: "Pick up vegetables and fruits from the market",
            done: false,
            created: getCurrentTimeStamp(),
            updated: getCurrentTimeStamp(),
            deadline: getCurrentTimeStamp(),
        },
        {
            id: "xyz",
            title: "Call client",
            description: "Discuss the new project requirements",
            done: true,
            created: getCurrentTimeStamp(),
            updated: getCurrentTimeStamp(),
            deadline: getCurrentTimeStamp(),
        },
    ];
</script>

<section>
    <Todos {todos} />
</section>
