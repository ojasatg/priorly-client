<script lang="ts">
    import { Button } from "stwui";
    import tooltip from "stwui/actions/tooltip";

    import type { TTodoAddResponseSchema } from "$schemas/response.schemas";
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

    const TODOS: TTodoAddResponseSchema[] = [
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
    <Todos todos={TODOS} />

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

    <PRDialog bind:modelValue={showAddTodoForm} title="Add Todo" subtitle="Add a new todo">
        <TodoForm todo={selectedTodo} on:cancel={onCancel} on:close={onCancel} slot="content" />
    </PRDialog>
</section>
