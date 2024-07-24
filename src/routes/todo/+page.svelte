<script lang="ts">
    // svelte imports
    import { onMount } from "svelte";
    import { Tabs } from "stwui";
    // other modules
    import _ from "lodash";

    // lib imports in order
    import { alerts } from "$lib/stores/AlertStore";
    import PRDialog from "$lib/components/PRDialog.svelte";
    import { cn } from "$lib/utils";

    // schemas and types (in order)
    import { ETodoToggleType, ETodoType, TODO_TYPE_TABS } from "$constants/todo.consts";
    import type {
        TTodoItemViewSchema,
        TCreateTodoResponseSchema,
        TEditTodoResponseSchema,
        TEditTodoChangesSchema,
        TAllTodosQuerySchema,
    } from "$schemas";

    // services
    import todoService from "$services/todo.service";

    // local components
    import TodosWrapperLoader from "$components/loaders/TodosWrapperLoader.svelte";
    import TodosWrapper from "$components/Todo/TodoWrappers/TodosWrapper.svelte";
    import TodoAppHeader from "$components/Todo/TodoAppHeader.svelte";
    import TodoAddForm from "$components/Todo/TodoForms/TodoAddForm.svelte";
    import TodoEditForm from "$components/Todo/TodoForms/TodoEditForm.svelte";
    import PinnedTodos from "$components/Todo/TodoWrappers/PinnedTodos.svelte";

    // local variables
    let editingTodo: TTodoItemViewSchema;
    let showUpdateTodoForm = false;
    let currentTab = `#${ETodoType.PINNED}`;

    let allTodos: TTodoItemViewSchema[] = [];
    let selectedTodos: TTodoItemViewSchema[] = [];

    let pinnedTodos: TTodoItemViewSchema[] = [];
    let pendingTodos: TTodoItemViewSchema[] = [];
    let doneTodos: TTodoItemViewSchema[] = [];

    let selectionMode = false;

    let fetchingTodos: boolean;
    let fetchTodoError: boolean;

    // event catchers
    async function deleteAPICall(id: string) {
        try {
            const todoId = id;
            await todoService.edit({
                showAlerts: false,
                queryParams: { id: todoId },
                requestData: { changes: { isDeleted: true } },
            });
            // not showing alerts on success for seamless ui experience
            return true;
        } catch (error) {
            console.error(error);
            alerts.error("Failed to delete the todo. Please try again later");
            return false;
        }
    }

    // functions
    async function deleteTodo(event: CustomEvent<{ id: string }>) {
        // Delete just marks the todo as deleted
        const todoId = event.detail.id;
        const todo = _.find(allTodos, { id: todoId }) as TTodoItemViewSchema; // backup the todo
        const todoIndex = _.findIndex(allTodos, { id: todoId }); // find the index of the todo before deleting
        try {
            _.remove(allTodos, { id: todoId }); // delete instantly
            _filterTodos(); // update the ui instantly
            await todoService.edit({
                queryParams: { id: todoId },
                requestData: { changes: { isDeleted: true } },
                showAlerts: false,
            });
        } catch (error) {
            // incase of error put the todo back
            allTodos.splice(todoIndex, 0, todo);
            _filterTodos(); // update the ui
            console.error(error);
            alerts.error(error as string);
        }
    }

    function afterCreateTodo(event: CustomEvent<TCreateTodoResponseSchema>) {
        const newTodo = { ...event.detail.todo, isSelected: false };
        allTodos.unshift(newTodo);
        _filterTodos(); //  reassign to update the UI
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
        _filterTodos();
    }

    // services
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
        }

        const newTodo = { ...oldTodo, ...changes, isDone: changes.isDone ?? false };

        allTodos.splice(todoIndex, 1); // removed the old todo from array
        // add the updated todo to the start of the array so that filter works properly - this won't work on reactive statements, as api is called after updating ui
        allTodos.unshift(newTodo);
        _filterTodos(); // update the ui

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
            _filterTodos(); // updating the ui
            alerts.error("Something went wrong! Please try again");
            console.error(error);
        }
    }

    async function getAllTodos(filters?: TAllTodosQuerySchema | null) {
        try {
            fetchingTodos = true;
            const data = await todoService.all({ queryParams: filters });
            const resTodos = data?.todos ?? [];
            allTodos = _.concat(allTodos, resTodos);
            allTodos = _.orderBy(allTodos, ["updatedOn"], "desc");
        } catch (error) {
            alerts.error("Failed to fetch todos, please try again");
            console.error(error);
            fetchTodoError = true;
        } finally {
            fetchingTodos = false;
        }
    }

    async function _refresh(event: CustomEvent<{ filters?: TAllTodosQuerySchema | undefined }>) {
        await getAllTodos(event.detail.filters);
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
        _filterTodos();
    }

    function _listenClickOutsideTodoItemCard(event: MouseEvent) {
        // Check if the click target is a todo-item-card or inside it
        if (!(event.target as HTMLElement)?.closest(".todo-item-card") && selectionMode) {
            // Click was outside any todo-item-card
            resetSelectionMode();
        }
    }

    function addEventListenerToTurnOffSelectionMode() {
        const appBody = document?.getElementById("todos-container");
        appBody?.addEventListener("click", _listenClickOutsideTodoItemCard);
    }

    function _filterTodos() {
        allTodos = allTodos;
        pinnedTodos = _.filter(allTodos, (todo) => !todo.isDone && todo.isPinned);
        pendingTodos = _.filter(allTodos, (todo) => !todo.isDone && !todo.isPinned);
        doneTodos = _.filter(allTodos, (todo) => todo.isDone);
    }

    // lifecycle methods
    onMount(async () => {
        await getAllTodos();
        addEventListenerToTurnOffSelectionMode();
        _filterTodos();
    });
</script>

<TodoAppHeader
    bind:allTodos
    bind:selectedTodos
    refreshing={fetchingTodos}
    on:refresh={_refresh}
    on:resetSelection={resetSelectionMode}
    on:filter={_filterTodos}
/>
<section id="todos-container">
    {#if !showUpdateTodoForm}
        <TodoAddForm
            on:create={afterCreateTodo}
            _class="fixed left-[48rem] top-32 z-20 mx-auto -ml-[24rem] w-[56rem]"
        />
    {/if}

    <section class="mx-auto mt-32 w-[68rem] px-4">
        <section class="mx-auto w-full pr-5">
            <Tabs {currentTab} variant="full-width">
                {#each TODO_TYPE_TABS as tab}
                    <Tabs.Tab
                        key={tab.href}
                        href={tab.href}
                        on:click={() => (currentTab = tab.href)}
                    >
                        <span slot="icon" class={cn("mt-1 h-6 w-6", tab.icon)} />
                        <span class="title-small">{tab.title}</span>
                    </Tabs.Tab>
                {/each}
            </Tabs>
        </section>
        <section class="h-[64vh] w-full overflow-y-scroll overscroll-none p-4 pb-8">
            {#if fetchingTodos}
                <TodosWrapperLoader _class="mt-4" />
            {:else if !fetchingTodos && !fetchTodoError}
                <section>
                    {#if currentTab === `#${ETodoType.PINNED}`}
                        <PinnedTodos {deleteAPICall} />
                    {/if}
                    {#if currentTab === `#${ETodoType.PENDING}`}
                        {#if _.isEmpty(pendingTodos) && _.isEmpty(pinnedTodos)}
                            <p class="body-large text-gray-400">Hurray! You're done for now!</p>
                        {/if}
                        {#if !_.isEmpty(pendingTodos)}
                            <TodosWrapper
                                bind:todos={pendingTodos}
                                on:delete={deleteTodo}
                                on:toggle={toggleTodo}
                                on:update={beforeUpdateTodo}
                            />
                        {:else}
                            <section class="text-gray-400">
                                <div class="i-mdi-format-list-checks mt-4 h-12 w-12" />
                                <p class="title-large">Todos you add will appear here</p>
                            </section>
                        {/if}
                    {/if}
                    {#if currentTab === `#${ETodoType.DONE}`}
                        {#if !_.isEmpty(doneTodos)}
                            <section>
                                <TodosWrapper
                                    bind:todos={doneTodos}
                                    on:delete={deleteTodo}
                                    on:toggle={toggleTodo}
                                    on:update={beforeUpdateTodo}
                                />
                            </section>
                        {:else}
                            <section class="text-gray-400">
                                <div class="i-mdi-format-list-checks mt-4 h-12 w-12" />
                                <p class="title-large">Todos you mark as done will appear here</p>
                            </section>
                        {/if}
                    {/if}
                </section>
            {:else}
                <section class="text-gray-400">
                    <div class="i-mdi-format-list-checks mt-4 h-12 w-12" />
                    <p class="title-large">Todos you add will appear here</p>
                </section>
            {/if}
        </section>
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
