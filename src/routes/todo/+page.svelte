<script lang="ts">
    import { Button } from "stwui";
    import tooltip from "stwui/actions/tooltip";
    import _ from "lodash";

    import PRDialog from "$lib/components/PRDialog.svelte";

    import type { TTodoItemSchema, TTodoItemViewSchema, TCreateTodoResponseSchema } from "$schemas";

    import TodosWrapper from "$components/Todo/TodosWrapper.svelte";
    import TodoForm from "$components/Todo/TodoForm.svelte";
    import todoService from "$services/todo.service";
    import { onMount } from "svelte";
    import { alerts } from "$lib/stores/alertStore";
    import TodosWrapperLoader from "$components/loaders/TodosWrapperLoader.svelte";

    const selectedTodo = {} as TTodoItemViewSchema;
    let showAddTodoForm = false;

    let allTodos: TTodoItemViewSchema[];
    let fetchingTodos: boolean;

    let pendingTodos: TTodoItemViewSchema[];
    let doneTodos: TTodoItemViewSchema[];

    function onCancel() {
        showAddTodoForm = false;
    }

    async function onDelete(event: CustomEvent<{ id: string; afterDeletion: () => void }>) {
        const todoId = event.detail.id;
        try {
            await todoService.deleteTodo({ requestData: { id: todoId }, showAlerts: true });
            _.remove(allTodos, { id: todoId });
            allTodos = allTodos; //  reassign to update the UI
        } catch (error) {
            console.error(error);
        } finally {
            event.detail.afterDeletion();
        }
    }

    function onCreate(event: CustomEvent<TCreateTodoResponseSchema>) {
        allTodos.push(event.detail.todo);
        allTodos = allTodos; //  reassign to update the UI
    }

    function _filterTodos(todos: TTodoItemViewSchema[], filter: Partial<TTodoItemSchema>) {
        return _.filter(allTodos, filter) as TTodoItemViewSchema[];
    }

    async function getAllTodos() {
        try {
            fetchingTodos = true;
            const data = await todoService.allTodos({});
            allTodos = data?.todos ?? [];
        } catch (error) {
            alerts.error("Failed to fetch todos, please try again");
            console.error(error);
        } finally {
            fetchingTodos = false;
        }
    }

    $: pendingTodos = _filterTodos(allTodos, { done: false });
    $: doneTodos = _filterTodos(allTodos, { done: true });

    onMount(() => {
        getAllTodos();
    });
</script>

<section>
    <section>
        <section class="mb-4 flex items-center justify-between">
            <p class="title-medium">My Todos</p>
            <span
                use:tooltip={{
                    placement: "top",
                    content: "Add a new Todo",
                    arrow: false,
                    animation: "scale",
                }}
                class="mb-3"
            >
                <Button
                    type="primary"
                    shape="pill"
                    size="md"
                    class="mt-4"
                    loading={showAddTodoForm}
                    on:click={() => (showAddTodoForm = true)}
                >
                    <span class="i-mdi-plus h-16 w-16" slot="leading" />
                    <span class="title-small mr-4">Add</span>
                </Button>
            </span>
        </section>
        {#if fetchingTodos}
            <TodosWrapperLoader />
        {:else if !fetchingTodos && !_.isEmpty(allTodos)}
            <p class="label-bold-medium mb-2">PENDING</p>
            <TodosWrapper todos={pendingTodos} on:delete={onDelete} />
            <p class="label-bold-medium mb-2 mt-4">DONE</p>
            <TodosWrapper todos={doneTodos} on:delete={onDelete} />
        {:else}
            <p class="body-medium text-gray-400">No items to show</p>
        {/if}
    </section>

    <PRDialog bind:modelValue={showAddTodoForm} title="Add Todo" subtitle="Add a new todo" scrim>
        <TodoForm
            todo={selectedTodo}
            on:create={onCreate}
            on:cancel={onCancel}
            on:close={onCancel}
            slot="content"
        />
    </PRDialog>
</section>
