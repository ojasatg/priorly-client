<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import _ from "lodash";
    import { alerts } from "$lib/stores/AlertStore";
    import PRLoadingBar from "$lib/components/PRLoadingBar.svelte";
    import type { TTodoItemViewSchema } from "$schemas";
    import todoService from "$services/todo.service";
    import TodosWrapper from "./TodosWrapper.svelte";

    export let deleteAPICall: (id: string) => Promise<boolean>;

    let todos: TTodoItemViewSchema[] = [];

    let fetchingTodos = false;
    let fetchTodoError = false;
    let cursor = 0;
    const limit = 10;

    // events
    // const dispatchEvent = createEventDispatcher<{
    //     delete: { id: string };
    //     unpin: { todo: TTodoItemViewSchema };
    //     markDone: { todo: TTodoItemViewSchema };
    // }>();

    // other functions
    async function onDelete(event: CustomEvent<{ id: string }>) {
        const todoId = event.detail.id;
        const todoIdx = _.findIndex(todos, { id: todoId });
        const todo = todos[todoIdx]; // backup the todo to be deleted

        _.remove(todos, { id: todoId });
        todos = todos; // update the ui instantly

        const deleteSuccessful = await deleteAPICall(todoId);

        if (!deleteSuccessful) {
            todos.splice(todoIdx, 0, todo); // place the todo back
            todos = todos; // update the ui
        }
    }

    // Mount functions
    async function fetchPinnedTodos() {
        try {
            fetchingTodos = true;
            const response = await todoService.all({
                queryParams: {
                    isPinned: true,
                    cursor: cursor,
                    limit: limit,
                },
                showAlerts: false,
            });

            const newTodos = response?.todos ?? [];
            todos = [...todos, ...newTodos];

            cursor = response?.cursor ?? -1;
        } catch (error) {
            console.error(error);
            alerts.error("Failed to fetch todos. Please try again later");
            fetchTodoError = true;
        } finally {
            fetchingTodos = false;
        }
    }

    // Lifecycle methods
    onMount(async () => {
        await fetchPinnedTodos();
    });
</script>

{#if !fetchingTodos && !_.isEmpty(todos)}
    <TodosWrapper bind:todos on:delete={onDelete} on:toggle on:update />
    {#if !fetchingTodos && fetchTodoError}
        <section class="text-gray-400">
            <div class="i-mdi-format-list-checks mt-4 h-12 w-12" />
            <p class="title-large">Error fetching todos, please try again later</p>
        </section>
    {:else if fetchingTodos}
        <PRLoadingBar />
    {/if}
{:else if !fetchingTodos && _.isEmpty(todos)}
    <section class="text-gray-400">
        <div class="i-mdi-format-list-checks mt-4 h-12 w-12" />
        <p class="title-large">Todos you pin will appear here</p>
    </section>
{/if}
