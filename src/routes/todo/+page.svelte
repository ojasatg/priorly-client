<script lang="ts">
    import { Button } from "stwui";
    import tooltip from "stwui/actions/tooltip";

    import PRDialog from "$lib/components/PRDialog.svelte";
    import type { TTodoItemSchema } from "$schemas";

    import AllTodos from "$components/Todo/AllTodos.svelte";
    import TodoForm from "$components/Todo/TodoForm.svelte";
    import todoService from "$services/todo.service";
    import { onMount } from "svelte";

    const selectedTodo = {} as TTodoItemSchema;
    let showAddTodoForm = false;

    let awaitingTodosData: Promise<{ todos: TTodoItemSchema[] } | undefined>;

    async function getAllTodos() {
        awaitingTodosData = todoService.allTodos({});
    }

    function onCancel() {
        showAddTodoForm = false;
    }

    onMount(() => {
        getAllTodos();
    });
</script>

<section>
    <AllTodos {awaitingTodosData} />

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
