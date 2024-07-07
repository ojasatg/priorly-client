<script lang="ts">
    import { type TTodoAddResponseSchema } from "$schemas/response.schemas";
    import Todos from "$components/Todo/Todos.svelte";

    import { getCurrentTimeStamp } from "$lib/utils/datetime.utils";

    const todos: TTodoAddResponseSchema[] = [
        {
            id: "abc",
            title: "Complete assignment",
            description: "Finish the project by the end of the week",
            done: false,
            created: getCurrentTimeStamp() - 9999999,
            updated: getCurrentTimeStamp(),
            deadline: getCurrentTimeStamp() + 10000000,
            reminder: getCurrentTimeStamp(),
        },
        {
            id: "pqr",
            title: "Buy groceries",
            description: "Pick up vegetables and fruits from the market",
            done: true,
            created: getCurrentTimeStamp(),
            updated: getCurrentTimeStamp(),
            completed: getCurrentTimeStamp() + 20000000,
        },
        {
            id: "xyz",
            title: "Call client",
            description: "Discuss the new project requirements",
            done: false,
            created: getCurrentTimeStamp(),
            updated: getCurrentTimeStamp(),
            deadline: getCurrentTimeStamp(),
            reminder: getCurrentTimeStamp(),
        },
    ];
</script>

<section>
    <Todos {todos} />
</section>
