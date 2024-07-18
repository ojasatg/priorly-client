<script lang="ts">
    // svelte imports
    import { onMount } from "svelte";
    import { Divider } from "stwui";
    // other modules
    import _ from "lodash";

    // lib imports in order
    import { alerts } from "$lib/stores/AlertStore";
    import PRDialog from "$lib/components/PRDialog.svelte";
    import { getCurrentTimeStamp } from "$lib/utils";

    // schemas and types (in order)
    import { ETodoToggleType } from "$constants/todo.consts";
    import type {
        TTodoItemViewSchema,
        TCreateTodoResponseSchema,
        TEditTodoResponseSchema,
        TEditTodoChangesSchema,
    } from "$schemas";

    // services
    import todoService from "$services/todo.service";

    // local components
    import TodosWrapperLoader from "$components/loaders/TodosWrapperLoader.svelte";
    import TodosWrapper from "$components/Todo/TodosWrapper.svelte";
    import TodoAppHeader from "$components/Todo/TodoAppHeader.svelte";
    import TodoAddForm from "$components/Todo/TodoAddForm.svelte";
    import TodoEditForm from "$components/Todo/TodoEditForm.svelte";

    // local variables
    let editingTodo: TTodoItemViewSchema;
    let showUpdateTodoForm = false;

    let allTodos: TTodoItemViewSchema[] = [];
    let selectedTodos: TTodoItemViewSchema[] = [];

    let selectionMode = false;

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
        if (!selectionMode) {
            // only show the update form when it is not in selection mode
            editingTodo = _.find(allTodos, { id: todoId })!;
            showUpdateTodoForm = true;
        }
    }

    function afterUpdateTodo(event: CustomEvent<TEditTodoResponseSchema>) {
        const updatedTodo = event.detail.todo;
        const todoIdx = _.findIndex(allTodos, { id: updatedTodo.id });
        allTodos.splice(todoIdx, 1);
        allTodos.unshift(updatedTodo);
        allTodos = allTodos;
    }

    async function toggleTodo(event: CustomEvent<{ id: string; action: ETodoToggleType }>) {
        const todoId = event.detail.id;
        const action = event.detail.action;

        const todoIndex = _.findIndex(allTodos, { id: todoId });
        const oldTodo = allTodos[todoIndex]; // back up the old values

        if (action === ETodoToggleType.SELECT) {
            if (oldTodo.isSelected) {
                oldTodo.isSelected = false;
                _.remove(selectedTodos, (todo) => todo.id === todoId);
            } else {
                oldTodo.isSelected = true;
                selectedTodos.push(oldTodo);
            }
            selectedTodos = selectedTodos; // update the ui
            selectionMode = selectedTodos.length > 0;
            return;
        }

        const changes: TEditTodoChangesSchema = {};

        if (action === ETodoToggleType.PIN) {
            changes.isPinned = !oldTodo.isPinned;
        }
        if (action === ETodoToggleType.DONE) {
            changes.isDone = !oldTodo.isDone;

            if (changes.isDone) {
                changes.isPinned = false;
                changes.completedOn = getCurrentTimeStamp();
                changes.reminder = undefined;
                changes.deadline = undefined;
            }
        }

        const newTodo = { ...oldTodo, ...changes, isDone: changes.isDone ?? false };

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
        editingTodo = {} as TTodoItemViewSchema;
        showUpdateTodoForm = false;
    }

    function resetSelectionMode() {
        selectionMode = false;
        selectedTodos = [];
        _.map(allTodos, (todo) => {
            todo.isSelected = false;
        });
        allTodos = allTodos;
    }

    function addEventListenerToTurnOffSelectionMode() {
        const appBody = document?.getElementById("priorly-app-body");
        appBody?.addEventListener("click", function (event: MouseEvent) {
            // Check if the click target is a todo-item-card or inside it
            if (!(event.target as HTMLElement)?.closest(".todo-item-card") && selectionMode) {
                // Click was outside any todo-item-card
                resetSelectionMode();
            }
        });
    }

    // reactive statements
    $: pinnedTodos = _.filter(allTodos, (todo) => !todo.isDone && todo.isPinned);
    $: pendingTodos = _.filter(allTodos, (todo) => !todo.isDone && !todo.isPinned);
    $: doneTodos = _.filter(allTodos, (todo) => todo.isDone);

    // lifecycle methods
    onMount(async () => {
        await getAllTodos();
        addEventListenerToTurnOffSelectionMode();
    });
</script>

<TodoAppHeader
    bind:allTodos
    bind:selectedTodos
    refreshing={fetchingTodos}
    on:refresh={getAllTodos}
    on:resetSelection={resetSelectionMode}
/>

{#if !showUpdateTodoForm}
    <section
        class="fixed left-[15rem] top-32 z-20 mx-auto -ml-[7.5rem] flex w-[60rem] items-start gap-4"
    >
        <TodoAddForm on:create={afterCreateTodo} _class="flex-grow" />
        <button class="mr-8 mt-7">Filters here</button>
    </section>
{/if}

<section class="mx-auto mt-32 grid w-[68rem] px-4">
    <Divider class="my-0" />
    <section class="h-[76vh] w-full overflow-y-scroll overscroll-none p-4">
        {#if fetchingTodos}
            <TodosWrapperLoader _class="mt-4" />
        {:else if !fetchingTodos && !fetchTodoError}
            <section>
                {#if !_.isEmpty(pinnedTodos)}
                    <section class="mb-2 ml-2 mt-4 flex items-start gap-1">
                        <span class="i-mdi-pin h-4 w-4 text-gray-500" />
                        <p class="label-bold-medium text-gray-500">PINNED</p>
                    </section>
                    <TodosWrapper
                        bind:todos={pinnedTodos}
                        bind:selectionMode
                        on:delete={deleteTodo}
                        on:toggle={toggleTodo}
                        on:update={beforeUpdateTodo}
                    />
                {/if}
                {#if !_.isEmpty(pendingTodos)}
                    <p class="label-bold-medium mb-2 ml-2 mt-4 text-gray-500">PENDING</p>
                    <TodosWrapper
                        bind:todos={pendingTodos}
                        bind:selectionMode
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
                        <p class="label-bold-medium mb-2 ml-2 mt-4 text-gray-500">DONE</p>
                        <TodosWrapper
                            bind:todos={doneTodos}
                            bind:selectionMode
                            on:delete={deleteTodo}
                            on:toggle={toggleTodo}
                            on:update={beforeUpdateTodo}
                        />
                    </section>
                {/if}
            </section>
        {:else}
            <section class="text-gray-400">
                <div class="i-mdi-document mt-4 h-12 w-12" />
                <p class="title-large">Notes you add will appear here</p>
            </section>
        {/if}
    </section>
</section>

{#if !_.isEmpty(editingTodo)}
    <PRDialog
        bind:model={showUpdateTodoForm}
        title="Edit Todo"
        subtitle="Edit this todo"
        showCloseBtn
        scrim
        _class="mt-16"
    >
        <TodoEditForm
            bind:todo={editingTodo}
            on:create={afterCreateTodo}
            on:update={afterUpdateTodo}
            on:cancel={closeTodoForm}
            on:close={closeTodoForm}
            slot="content"
        />
    </PRDialog>
{/if}
