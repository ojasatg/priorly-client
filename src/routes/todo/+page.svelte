<script lang="ts">
    // svelte imports
    import { onMount } from "svelte";
    // component imports
    import { Button } from "stwui";
    import tooltip from "stwui/actions/tooltip";
    // other modules
    import _ from "lodash";

    // lib imports in order
    import { alerts } from "$lib/stores/AlertStore";
    import PRDialog from "$lib/components/PRDialog.svelte";

    // schemas and types (in order)
    import type { TTodoItemViewSchema, TCreateTodoResponseSchema } from "$schemas";

    // services
    import todoService from "$services/todo.service";

    // local components
    import TodosWrapperLoader from "$components/loaders/TodosWrapperLoader.svelte";
    import TodosWrapper from "$components/Todo/TodosWrapper.svelte";
    import TodoForm from "$components/Todo/TodoForm.svelte";

    // local variables
    const selectedTodo = {} as TTodoItemViewSchema;
    let showAddTodoForm = false;

    let allTodos: TTodoItemViewSchema[] = [];
    let fetchingTodos: boolean;
    let fetchTodoError: boolean;

    // event catchers
    function cancelTodoCreation() {
        showAddTodoForm = false;
    }

    // functions
    async function deleteTodo(event: CustomEvent<{ id: string; afterDeletion: () => void }>) {
        const todoId = event.detail.id;
        try {
            await todoService.remove({ queryParams: { id: todoId }, showAlerts: true });
            _.remove(allTodos, { id: todoId });
            allTodos = allTodos; //  reassign to update the UI
        } catch (error) {
            console.error(error);
        } finally {
            event.detail.afterDeletion();
        }
    }

    function createTodo(event: CustomEvent<TCreateTodoResponseSchema>) {
        allTodos.unshift(event.detail.todo);
        allTodos = allTodos; //  reassign to update the UI
    }

    async function getAllTodos() {
        try {
            fetchingTodos = true;
            const data = await todoService.all({});
            allTodos = data?.todos ?? [];
        } catch (error) {
            alerts.error("Failed to fetch todos, please try again");
            console.error(error);
            fetchTodoError = true;
        } finally {
            fetchingTodos = false;
        }
    }

    async function toggleTodoPin(event: CustomEvent<{ id: string; afterToggle: () => void }>) {
        console.log("pin toggled");
        event.detail.afterToggle();
    }

    // reactive statements
    $: pinnedTodos = allTodos.filter((todo) => !todo.isDone && todo.isPinned);
    $: pendingTodos = allTodos.filter((todo) => !todo.isDone && !todo.isPinned);
    $: doneTodos = allTodos.filter((todo) => todo.isDone);

    // lifecycle methods
    onMount(() => {
        getAllTodos();
    });
</script>

<section>
    <section class="mb-4 flex items-center gap-2">
        <p class="title-medium">My Todos</p>
        <span
            use:tooltip={{
                placement: "top",
                content: "Refresh",
                arrow: false,
                animation: "scale",
            }}
            class="w-fit"
        >
            <Button
                shape="circle"
                size="lg"
                on:click={getAllTodos}
                disabled={fetchingTodos}
                loading={fetchingTodos}
            >
                <span slot="icon" class="i-mdi-refresh h-16 w-16" />
            </Button>
        </span>
        <span
            use:tooltip={{
                placement: "top",
                content: "Add a new Todo",
                arrow: false,
                animation: "scale",
            }}
            class="mb-3 ml-auto"
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
    {:else if !fetchingTodos && !fetchTodoError}
        <section class="grid gap-4">
            {#if !_.isEmpty(pinnedTodos)}
                <section class="mb-2 flex items-start gap-1">
                    <span class="i-mdi-pin h-4 w-4 text-gray-500" />
                    <p class="label-bold-medium text-gray-500">PINNED</p>
                </section>
                <TodosWrapper
                    todos={pinnedTodos}
                    on:delete={deleteTodo}
                    on:togglePin={toggleTodoPin}
                />
            {/if}
            {#if !_.isEmpty(pendingTodos)}
                <p class="label-bold-medium mb-2 text-gray-500">PENDING</p>
                <TodosWrapper
                    todos={pendingTodos}
                    on:delete={deleteTodo}
                    on:togglePin={toggleTodoPin}
                />
            {/if}
            {#if !_.isEmpty(doneTodos)}
                {#if _.isEmpty(pendingTodos)}
                    <p class="body-medium text-gray-600">Hurray! You're done for now!</p>
                {/if}
                <section>
                    <p class="label-bold-medium mb-2 text-gray-500">DONE</p>
                    <TodosWrapper
                        todos={doneTodos}
                        on:delete={deleteTodo}
                        on:togglePin={toggleTodoPin}
                    />
                </section>
            {/if}
        </section>
    {:else}
        <p class="body-medium text-gray-600">No items to show</p>
    {/if}
</section>

<PRDialog bind:modelValue={showAddTodoForm} title="Add Todo" subtitle="Add a new todo" scrim>
    <TodoForm
        todo={selectedTodo}
        on:create={createTodo}
        on:cancel={cancelTodoCreation}
        on:close={cancelTodoCreation}
        slot="content"
    />
</PRDialog>
