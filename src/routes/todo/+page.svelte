<script lang="ts">
    import { type TTodoResponseSchema } from "$schemas/response.schemas";
    import Todos from "$components/Todo/Todos.svelte";

    import { getCurrentTimeStamp } from "$lib/utils/datetime.utils";

    const todos: TTodoResponseSchema[] = [
        {
            id: "abc",
            title: "Complete assignment",
            description: "Finish the project by the end of the week",
            done: false,
            created: getCurrentTimeStamp(),
            updated: getCurrentTimeStamp(),
            deadline: getCurrentTimeStamp(),
            reminder: getCurrentTimeStamp(),
        },
        {
            id: "pqr",
            title: "Buy groceries",
            description: "Pick up vegetables and fruits from the market",
            done: false,
            created: getCurrentTimeStamp(),
            updated: getCurrentTimeStamp(),
            deadline: getCurrentTimeStamp(),
            reminder: getCurrentTimeStamp(),
        },
        {
            id: "xyz",
            title: "Call client",
            description: "Discuss the new project requirements",
            done: true,
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
