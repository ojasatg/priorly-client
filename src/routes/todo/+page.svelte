<script lang="ts">
    import { Button } from "stwui";
    import tooltip from "stwui/actions/tooltip";

    import type { TTodoItemViewSchema } from "$schemas/view.schemas";

    import TodoForm from "$components/Todo/TodoForm.svelte";

    import PRDialog from "$lib/components/PRDialog.svelte";

    const selectedTodo = {} as TTodoItemViewSchema;

    let showAddTodoForm = false;

    function onCancel() {
        showAddTodoForm = false;
    }

    import { getCurrentTimeStamp } from "$lib/utils/datetime.utils";
    import Todos from "$components/Todo/Todos.svelte";
    import { mockAPIResponse } from "$lib/utils/api.utils";

    // Get todos schema
    const TODOS = [
        {
            id: "abc",
            title: "Complete assignment",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eleifend sed turpis a fringilla. Etiam nec felis in dolor lobortis accumsan. Mauris convallis bibendum purus vel interdum. Cras finibus ligula et volutpat consectetur. Sed eros nunc, lacinia rutrum ornare vel, efficitur at sem. Integer id.",
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

    const todos = mockAPIResponse<TTodoItemViewSchema[]>(TODOS, 4000);
</script>

<section>
    <Todos {todos} />

    <span
        use:tooltip={{
            placement: "top",
            content: "Add New",
            arrow: false,
            animation: "scale",
        }}
    >
        <Button
            type="primary"
            size="lg"
            shape="circle"
            class="mt-4"
            on:click={() => (showAddTodoForm = true)}
        >
            <span class="i-mdi-plus h-12 w-12" slot="icon" />
        </Button>
    </span>

    <PRDialog bind:modelValue={showAddTodoForm} title="Add Todo" subtitle="Add a new todo" scrim>
        <TodoForm todo={selectedTodo} on:cancel={onCancel} on:close={onCancel} slot="content" />
    </PRDialog>
</section>
