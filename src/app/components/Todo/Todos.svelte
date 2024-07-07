<script lang="ts">
    import { Button } from "stwui";
    import tooltip from "stwui/actions/tooltip";

    import { type TTodoAddResponseSchema } from "$schemas/response.schemas";
    import TodoForm from "./TodoForm.svelte";
    import TodoItem from "./TodoItem.svelte";

    import PRDialog from "$lib/components/PRDialog.svelte";
    import type { TTodoAddRequestSchema } from "$schemas/request.schemas";
    import { useTodoCreate } from "../../services/todo.service";

    export let todos: TTodoAddResponseSchema[];

    const selectedTodo = {} as TTodoAddResponseSchema;

    let showAddTodoForm = false;

    async function onAdd(event: CustomEvent<TTodoAddRequestSchema>) {
        const newTodo = event.detail;
        useTodoCreate({ requestData: newTodo });
    }

    function onCancel() {
        showAddTodoForm = false;
    }
</script>

<section>
    <section class="grid grid-cols-3 gap-2">
        {#each todos as todo}
            <TodoItem {todo} />
        {/each}
    </section>
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

    <PRDialog bind:modelValue={showAddTodoForm} title="Add Todo" subtitle="Add a new todo item">
        <TodoForm
            todo={selectedTodo}
            on:add={onAdd}
            on:cancel={onCancel}
            on:close={onCancel}
            slot="content"
        />
    </PRDialog>
</section>
