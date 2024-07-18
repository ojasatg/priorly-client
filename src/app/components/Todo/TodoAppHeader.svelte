<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { Button, Input } from "stwui";
    import { tooltip } from "stwui/actions";
    import _ from "lodash";

    import { cn } from "$lib/utils";
    import PRPrompt from "$lib/components/PRPrompt.svelte";

    // schemas
    import { ETodoBulkOperation, ETodoToggleType } from "$constants/todo.consts";
    import type { TTodoBulkOperationResponseSchema, TTodoItemViewSchema } from "$schemas";
    import todoService from "$services/todo.service";
    import { alerts } from "$lib/stores/AlertStore";

    // services

    export let refreshing = false;
    export let todoSearchVal = "";
    export let selectedTodos: TTodoItemViewSchema[] = [];
    export let allTodos: TTodoItemViewSchema[] = [];

    let showDeletePrompt = false;

    const dispatchEvent = createEventDispatcher<{
        refresh: null;
        addTodo: null;
        bulkToggle: { todos: TTodoItemViewSchema[]; action: ETodoToggleType };
        resetSelection: null;
    }>();

    // bulk delete api
    async function bulkDelete() {
        const toBeDeleted = _.intersection(allTodos, selectedTodos);
        refreshing = true;
        allTodos = _.difference(allTodos, toBeDeleted);
        let response: TTodoBulkOperationResponseSchema | undefined;
        try {
            response = await todoService.bulk({
                requestData: {
                    ids: _.map(selectedTodos, (todo) => todo.id),
                    operation: ETodoBulkOperation.DELETE,
                },
                showAlerts: false,
            });
            console.info(response);
            alerts.success("Todos deleted successfully");
        } catch (error) {
            // put back everything when deletion fails
            _.concat(allTodos, toBeDeleted);
            allTodos = allTodos;
            console.error(error);
            alerts.error("Cannot delete todos");
        } finally {
            refreshing = false;
            dispatchEvent("resetSelection");
        }
    }

    // bulk pin api
    async function bulkTogglePin() {
        // done todos cannot be pinned!
        // do not toggle all of them - toggle only some of them which are not toggled.
        console.log(selectedTodos);
    }

    // bulk done api
    async function bulkToggleDone() {
        // do not toggle all of them - toggle only some of them which are not toggled.
        console.log(selectedTodos);
    }

    $: allSelectedPinned = _.every(selectedTodos, (todo) => todo.isPinned === true);
    $: allSelectedDone = _.every(selectedTodos, (todo) => todo.isDone === true);
</script>

<section
    class="border-b-1 gradient-surface z-10 my-4 mb-8 flex h-16 items-center gap-2 border-b-2 border-gray-200 px-4 pb-4"
>
    <Button size="lg" shape="circle">
        <span slot="icon" class="title-large i-mdi-menu text-gray-500" />
    </Button>

    <span class="headline-medium i-mdi-document ml-12 text-yellow-400" />
    <p class="title-medium text-gray-600">Todos</p>
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
            on:click={() => dispatchEvent("refresh")}
            disabled={refreshing}
            loading={refreshing}
        >
            <span slot="icon" class="i-mdi-refresh h-16 w-16 text-gray-600" />
        </Button>
    </span>

    <Input
        name="todo-search"
        placeholder="Search todos..."
        bind:value={todoSearchVal}
        type="text"
        allowClear
        class="ml-8 w-[32rem]"
    />

    {#if selectedTodos.length}
        <span
            use:tooltip={{
                placement: "top",
                content: allSelectedPinned ? "Unpin selected" : "Pin selected",
                arrow: false,
                animation: "scale",
            }}
            class="ml-2 mt-1 w-fit"
        >
            <Button
                size="lg"
                shape="circle"
                loading={refreshing}
                disabled={refreshing}
                on:click={bulkTogglePin}
            >
                <span
                    slot="icon"
                    class={cn("h-12 w-12", {
                        "i-mdi-pin-off": allSelectedPinned,
                        "i-mdi-pin-outline": !allSelectedPinned,
                    })}
                >
                </span>
            </Button>
        </span>
        <span
            use:tooltip={{
                placement: "top",
                content: allSelectedDone ? "Mark selected as not done" : "Mark selected as done",
                arrow: false,
                animation: "scale",
            }}
            class="ml-2 mt-1 w-fit"
        >
            <Button
                size="lg"
                shape="circle"
                loading={refreshing}
                disabled={refreshing}
                on:click={bulkToggleDone}
            >
                <span
                    slot="icon"
                    class={cn("h-12 w-12", {
                        "i-mdi-checkbox-marked-circle-minus-outline text-error": allSelectedDone,
                        "i-mdi-checkbox-marked-circle-plus-outline text-success": !allSelectedDone,
                    })}
                />
            </Button>
        </span>

        <span
            use:tooltip={{
                placement: "top",
                content: "Delete selected",
                arrow: false,
                animation: "scale",
            }}
            class="ml-auto mt-1 w-fit"
        >
            <Button
                size="lg"
                shape="circle"
                loading={refreshing}
                disabled={refreshing}
                on:click={() => (showDeletePrompt = true)}
            >
                <span slot="icon" class="i-carbon-trash-can h-12 w-12 text-error" />
            </Button>
        </span>
    {/if}
</section>

<PRPrompt
    bind:model={showDeletePrompt}
    title="Delete Selected Todos?"
    message="All selected todos will be deleted"
    note="This operation is irreversible"
    type="error"
    submitText="Delete"
    cancelText="Cancel"
    on:submit={bulkDelete}
/>
