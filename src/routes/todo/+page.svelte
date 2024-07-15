<script lang="ts">
    // svelte imports
    import { onMount } from "svelte";
    // other modules
    import _ from "lodash";

    // lib imports in order
    import { alerts } from "$lib/stores/AlertStore";
    import PRDialog from "$lib/components/PRDialog.svelte";

    // schemas and types (in order)
    import { ETodoFormType, ETodoToggleType } from "$constants/todo.consts";
    import type {
        TTodoItemViewSchema,
        TCreateTodoResponseSchema,
        TEditTodoResponseSchema,
        TTodoItemResponseSchema,
    } from "$schemas";

    // services
    import todoService from "$services/todo.service";

    // local components
    import TodosWrapperLoader from "$components/loaders/TodosWrapperLoader.svelte";
    import TodosWrapper from "$components/Todo/TodosWrapper.svelte";
    import TodoAppHeader from "$components/Todo/TodoAppHeader.svelte";
    import TodoForm from "$components/Todo/TodoForm.svelte";
    import { getCurrentTimeStamp } from "$lib/utils";

    // local variables
    let editingTodo: TTodoItemViewSchema | undefined = undefined;
    let todoFormType = ETodoFormType.ADD;
    let showAddTodoForm = false;

    let allTodos: TTodoItemViewSchema[] = [];
    const selectedTodos = new Set<string>();
    let fetchingTodos: boolean;
    let fetchTodoError: boolean;

    // event catchers

    // functions
    async function deleteTodo(event: CustomEvent<{ id: string; afterDeletion?: () => void }>) {
        const todoId = event.detail.id;
        const todo = _.find(allTodos, { id: todoId }) as TTodoItemViewSchema; // backup the todo
        const todoIndex = _.findIndex(allTodos, { id: todoId }); // find the index of the todo before deleting
        try {
            _.remove(allTodos, { id: todoId }); // delete instantly
            allTodos = allTodos; // update the ui instantly
            await todoService.remove({ queryParams: { id: todoId }, showAlerts: true });
        } catch (error) {
            // incase of error put the todo back
            allTodos.splice(todoIndex, 0, todo);
            allTodos = allTodos; // update the ui
            console.error(error);
        } finally {
            event.detail.afterDeletion?.();
        }
    }

    function afterCreateTodo(event: CustomEvent<TCreateTodoResponseSchema>) {
        const newTodo = { ...event.detail.todo, isSelected: false };
        allTodos.unshift(newTodo);
        allTodos = allTodos; //  reassign to update the UI
    }

    function beforeUpdateTodo(event: CustomEvent<{ id: string }>) {
        const todoId = event.detail.id;
        todoFormType = ETodoFormType.EDIT;
        editingTodo = _.find(allTodos, { id: todoId });
        showAddTodoForm = true;
    }

    function afterUpdateTodo(event: CustomEvent<TEditTodoResponseSchema>) {
        const updatedTodo = event.detail.todo;
        const todoIdx = _.findIndex(allTodos, { id: updatedTodo.id });
        allTodos.splice(todoIdx, 1);
        allTodos.unshift(updatedTodo);
        allTodos = allTodos;
    }

    async function toggleTodo(event: CustomEvent<{ id: string; toggleValue: ETodoToggleType }>) {
        const todoId = event.detail.id;
        const toggleValue = event.detail.toggleValue;

        const todoIndex = _.findIndex(allTodos, { id: todoId });
        const oldTodo = allTodos[todoIndex]; // back up the old values

        if (toggleValue === ETodoToggleType.SELECT) {
            if (oldTodo.isSelected) {
                oldTodo.isSelected = false;
            } else {
                oldTodo.isSelected = true;
                selectedTodos.add(todoId);
            }
            return;
        }

        const changes: Partial<TTodoItemResponseSchema> = {};

        if (toggleValue === ETodoToggleType.PIN) {
            changes.isPinned = !oldTodo.isPinned;
        }
        if (toggleValue === ETodoToggleType.DONE) {
            if (oldTodo.isDone) {
                // todo is moving from pinned to done, then remove the pin status
                changes.isPinned = false;
            }
            changes.isDone = !oldTodo.isDone;
            if (changes.isDone) {
                changes.completedOn = getCurrentTimeStamp();
            }
        }
        const newTodo = { ...oldTodo, ...changes };

        allTodos.splice(todoIndex, 1); // removed the old todo from array
        // add the updated todo to the start of the array so that filter works properly - this won't work on reactive statements, as api is called after updating ui
        allTodos.unshift(newTodo);
        allTodos = allTodos; // update the ui

        try {
            await todoService.edit({
                queryParams: { id: todoId },
                requestData: { changes },
                showAlerts: false,
            });
        } catch (error) {
            // in case some error happens in the backend while updating
            allTodos.splice(0, 1); // remove the updated todo from the first index
            allTodos.splice(todoIndex, 0, oldTodo); // placing back the old todo in case of any error
            allTodos = allTodos; // updating the ui
            alerts.error("Something went wrong! Please try again");
            console.error(error);
        }
    }

    async function getAllTodos() {
        try {
            fetchingTodos = true;
            const data = await todoService.all({});
            allTodos = data?.todos ?? [];
            allTodos = _.orderBy(allTodos, ["updatedOn"], "desc");
        } catch (error) {
            alerts.error("Failed to fetch todos, please try again");
            console.error(error);
            fetchTodoError = true;
        } finally {
            fetchingTodos = false;
        }
    }

    function closeTodoForm() {
        editingTodo = undefined;
        showAddTodoForm = false;
    }

    // reactive statements
    $: pinnedTodos = _.filter(allTodos, (todo) => !todo.isDone && todo.isPinned);
    $: pendingTodos = _.filter(allTodos, (todo) => !todo.isDone && !todo.isPinned);
    $: doneTodos = _.filter(allTodos, (todo) => todo.isDone);

    // lifecycle methods
    onMount(async () => {
        await getAllTodos();
    });
</script>

<TodoAppHeader refreshing={fetchingTodos} on:refresh={getAllTodos} />

<TodoForm formType={ETodoFormType.ADD} on:create={afterCreateTodo} />

{#if fetchingTodos}
    <TodosWrapperLoader classNames="mt-4" />
{:else if !fetchingTodos && !fetchTodoError}
    <section class="grid gap-4">
        {#if !_.isEmpty(pinnedTodos)}
            <section class="mb-2 mt-4 flex items-start gap-1">
                <span class="i-mdi-pin h-4 w-4 text-gray-500" />
                <p class="label-bold-medium text-gray-500">PINNED</p>
            </section>
            <TodosWrapper
                todos={pinnedTodos}
                on:delete={deleteTodo}
                on:toggle={toggleTodo}
                on:update={beforeUpdateTodo}
            />
        {/if}
        {#if !_.isEmpty(pendingTodos)}
            <p class="label-bold-medium mb-2 text-gray-500">PENDING</p>
            <TodosWrapper
                todos={pendingTodos}
                on:delete={deleteTodo}
                on:toggle={toggleTodo}
                on:update={beforeUpdateTodo}
            />
        {/if}
        {#if !_.isEmpty(doneTodos)}
            {#if _.isEmpty(pendingTodos) && _.isEmpty(pinnedTodos)}
                <p class="body-large">Hurray! You're done for now!</p>
            {/if}
            <section>
                <p class="label-bold-medium mb-2 text-gray-500">DONE</p>
                <TodosWrapper
                    todos={doneTodos}
                    on:delete={deleteTodo}
                    on:toggle={toggleTodo}
                    on:update={beforeUpdateTodo}
                />
            </section>
        {/if}
    </section>
{:else}
    <section class=" text-gray-400">
        <div class="i-mdi-document h-12 w-12" />
        <p class="title-large">Notes you add will appear here</p>
    </section>
{/if}

<PRDialog
    bind:modelValue={showAddTodoForm}
    title={todoFormType === ETodoFormType.ADD ? "Add Todo" : "Edit Todo"}
    subtitle={todoFormType === ETodoFormType.ADD ? "Add a new todo" : "Edit this todo"}
    showCloseBtn
    scrim
>
    <TodoForm
        bind:todo={editingTodo}
        formType={todoFormType}
        on:create={afterCreateTodo}
        on:update={afterUpdateTodo}
        on:cancel={closeTodoForm}
        on:close={closeTodoForm}
        slot="content"
    />
</PRDialog>
