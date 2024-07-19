<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { Button, Input } from "stwui";
    import { tooltip } from "stwui/actions";
    import _ from "lodash";

    import { cn } from "$lib/utils";
    import PRPrompt from "$lib/components/PRPrompt.svelte";

    // schemas
    import { ETodoBulkOperation, ETodoToggleType } from "$constants/todo.consts";
    import type { TTodoItemViewSchema } from "$schemas";
    import todoService from "$services/todo.service";
    import { alerts } from "$lib/stores/AlertStore";

    // services
    export let refreshing = false;
    export let todoSearchVal = "";
    export let selectedTodos: TTodoItemViewSchema[];
    export let allTodos: TTodoItemViewSchema[] = [];

    const TODO_OPERATION_MESSAGES = {
        [ETodoBulkOperation.PIN]: "Todos pinned successfully",
        [ETodoBulkOperation.UNPIN]: "Todos unpinned successfully",
        [ETodoBulkOperation.DONE]: "Todos marked as done successfully",
        [ETodoBulkOperation.NOT_DONE]: "Todos marked as not done successfully",
        [ETodoBulkOperation.DELETE]: "Todos deleted successfully",
    };

    let showDeletePrompt = false;

    const dispatchEvent = createEventDispatcher<{
        refresh: null;
        bulkToggle: { todos: TTodoItemViewSchema[]; action: ETodoToggleType };
        resetSelection: null;
    }>();

    async function _bulkToggle(operation: ETodoBulkOperation) {
        const fieldToBeOperated =
            operation === ETodoBulkOperation.PIN || operation === ETodoBulkOperation.UNPIN
                ? "isPinned"
                : "isDone";
        const valueToBeSet =
            operation === ETodoBulkOperation.PIN || operation === ETodoBulkOperation.DONE;

        // for pin operation we want the unpinned todos, same for done and vice versa
        const toBeOperated = _.map(selectedTodos, (todo) => {
            if (todo[fieldToBeOperated] !== valueToBeSet) {
                return todo.id;
            }
        });

        _.map(allTodos, (todo) => {
            if (_.includes(toBeOperated, todo.id)) {
                todo[fieldToBeOperated] = valueToBeSet;
            }
        });
        allTodos = allTodos;
        _.remove(toBeOperated, (id) => !id); // removing undefined/null/empty values from to be operated

        if (!_.isEmpty(toBeOperated)) {
            try {
                refreshing = true;
                await todoService.bulk({
                    requestData: {
                        ids: toBeOperated as string[],
                        operation,
                    },
                    showAlerts: false,
                });
                alerts.success(TODO_OPERATION_MESSAGES[operation]);
            } catch (error) {
                // rollback the operation
                _.map(allTodos, (todo) => {
                    if (_.includes(toBeOperated, todo.id)) {
                        todo[fieldToBeOperated] = !valueToBeSet;
                    }
                });
                allTodos = allTodos;
                console.error(error);
            } finally {
                refreshing = false;
                dispatchEvent("resetSelection");
            }
        } else {
            throw new Error("No todo item selected for the bulk operation");
        }
    }

    // bulk delete api
    async function bulkDelete() {
        const toBeDeleted = _.intersection(allTodos, selectedTodos);
        allTodos = _.difference(allTodos, toBeDeleted);
        const ids = _.map(selectedTodos, (todo) => todo.id);
        try {
            refreshing = true;
            await todoService.bulk({
                requestData: {
                    ids,
                    operation: ETodoBulkOperation.DELETE,
                },
                showAlerts: false,
            });
            alerts.success(TODO_OPERATION_MESSAGES[ETodoBulkOperation.DELETE]);
        } catch (error) {
            // put back everything when deletion fails
            _.concat(allTodos, toBeDeleted);
            allTodos = allTodos;
            console.error(error);
            alerts.error("Error deleting todos");
        } finally {
            refreshing = false;
            dispatchEvent("resetSelection");
        }
    }

    // bulk pin api
    async function bulkPin() {
        await _bulkToggle(ETodoBulkOperation.PIN);
    }

    // bulk unpin api
    async function bulkUnpin() {
        await _bulkToggle(ETodoBulkOperation.UNPIN);
    }

    // bulk done api
    async function bulkMarkDone() {
        await _bulkToggle(ETodoBulkOperation.DONE);
    }

    async function bulkMarkNotdone() {
        await _bulkToggle(ETodoBulkOperation.NOT_DONE);
    }

    $: allSelectedPinned = _.every(selectedTodos, (todo) => todo.isPinned === true);
    $: allSelectedDone = _.every(selectedTodos, (todo) => todo.isDone === true);

    $: pinnedSelected = _.findIndex(selectedTodos, (todo) => todo.isPinned === true) !== -1;
    $: notPinnedSelected = _.findIndex(selectedTodos, (todo) => todo.isPinned === false) !== -1;
    $: pendingSelected = _.findIndex(selectedTodos, (todo) => todo.isDone === false) !== -1;
    $: doneSelected = _.findIndex(selectedTodos, (todo) => todo.isDone === true) !== -1;

    $: showPin = !(pinnedSelected && notPinnedSelected) && !doneSelected; // if not both selected then only show pin
    $: showDone = !(pendingSelected && doneSelected);
</script>

<section
    class="border-b-1 gradient-surface z-10 my-4 mb-8 flex h-16 items-center gap-2 border-b-2 border-gray-200 px-4 pb-4"
>
    <Button size="lg" shape="circle">
        <span slot="icon" class="title-large i-mdi-menu text-gray-500" />
    </Button>

    <span class="headline-medium i-mdi-format-list-checks ml-12 text-yellow-500" />
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
        {#if showPin}
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
                    on:click={allSelectedPinned ? bulkUnpin : bulkPin}
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
        {/if}

        {#if showDone}
            <span
                use:tooltip={{
                    placement: "top",
                    content: allSelectedDone
                        ? "Mark selected as not done"
                        : "Mark selected as done",
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
                    on:click={allSelectedDone ? bulkMarkNotdone : bulkMarkDone}
                >
                    <span
                        slot="icon"
                        class={cn("h-12 w-12", {
                            "i-mdi-checkbox-marked-circle-minus-outline text-error":
                                allSelectedDone,
                            "i-mdi-checkbox-marked-circle-plus-outline text-success":
                                !allSelectedDone,
                        })}
                    />
                </Button>
            </span>
        {/if}

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
