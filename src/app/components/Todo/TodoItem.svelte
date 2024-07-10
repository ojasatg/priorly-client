<script lang="ts">
    // node imports
    import { createEventDispatcher } from "svelte";
    import { Button } from "stwui";
    import tooltip from "stwui/actions/tooltip";

    import PRDivider from "$lib/components/PRDivider.svelte";

    // local imports
    import { type TTodoItemViewSchema } from "$schemas";
    import { getFormattedTimestamp, getDaysDifferenceFromTimestamp } from "$lib/utils";

    const CUSTOM_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
    };

    export let todo: TTodoItemViewSchema;
    let deleting = false;

    const daysRemainingFromDeadline = getDaysDifferenceFromTimestamp(todo.deadline ?? 0);

    const dispatchEvent = createEventDispatcher<{
        delete: {
            id: string;
            afterDeletion: () => void;
        };
    }>();

    function onDelete() {
        deleting = true;
        dispatchEvent("delete", {
            id: todo.id,
            afterDeletion: () => {
                deleting = false;
            },
        });
    }

    $: deadline_class = daysRemainingFromDeadline < 7 ? "text-error" : "";
</script>

<section
    id={`todo-item-${todo.id}`}
    class="card h-fit w-80 rounded-md bg-white px-4 pb-4 pt-2 shadow-md shadow-gray-400"
>
    <header class="flex items-center justify-between gap-2">
        <p class="title-medium card-header flex-grow p-0" class:line-through={todo.done}>
            {todo.title}
        </p>
        <span
            use:tooltip={{
                placement: "top",
                content: "Edit",
                arrow: false,
                animation: "scale",
            }}
            class="mt-1"
        >
            <Button size="lg" shape="circle" loading={deleting}>
                <span slot="icon" class="i-mdi-application-edit-outline"> </span>
            </Button>
        </span>
    </header>
    <p class="body-medium my-4 text-wrap">{todo.description}</p>
    <section class="card-footer mt-2 p-0">
        <section class="flex items-end justify-between">
            <section>
                <p class="label-medium inline text-gray-600">Created on</p>
                <p class="label-medium inline text-gray-900">
                    {getFormattedTimestamp(todo.created, CUSTOM_DATE_OPTIONS)}
                </p>
                <section />
                <p class="label-medium inline text-gray-600">Last updated on</p>
                <p class="label-medium inline text-gray-900">
                    {getFormattedTimestamp(todo.updated, CUSTOM_DATE_OPTIONS)}
                </p>
            </section>
            <span
                use:tooltip={{
                    placement: "top",
                    content: "Delete",
                    arrow: false,
                    animation: "scale",
                }}
            >
                <Button size="lg" shape="circle" loading={deleting} on:click={onDelete}>
                    <span slot="icon" class="i-carbon-trash-can h-4 w-4 text-error"> </span>
                </Button>
            </span>
        </section>

        {#if todo.reminder || todo.deadline || todo.completed}
            <PRDivider />
            <section class="flex flex-col gap-1">
                {#if todo.reminder}
                    <section
                        use:tooltip={{
                            placement: "bottom-start",
                            content: "Reminder",
                            arrow: false,
                            animation: "scale",
                        }}
                        class="card-footer flex items-center gap-1 p-0"
                    >
                        <span class="i-mdi-alarm"></span>
                        <p class="label-medium inline">
                            {getFormattedTimestamp(todo.reminder)}
                        </p>
                    </section>
                {/if}
                {#if todo.deadline}
                    <section
                        use:tooltip={{
                            placement: "bottom-start",
                            content: "Deadline",
                            arrow: false,
                            animation: "scale",
                        }}
                        class="card-footer flex items-center gap-1 p-0 {deadline_class}"
                    >
                        <span class="i-mdi-clock-alert-outline"></span>
                        <p class="label-medium inline">
                            {getFormattedTimestamp(todo.deadline, CUSTOM_DATE_OPTIONS)}
                        </p>
                    </section>
                {/if}

                {#if todo.completed}
                    <section
                        use:tooltip={{
                            placement: "bottom-start",
                            content: "Completed",
                            arrow: false,
                            animation: "scale",
                        }}
                        class="card-footer flex items-center gap-1 p-0 text-success"
                    >
                        <span class="i-mdi-checkbox-marked-circle-outline"></span>
                        <p class="label-medium inline">
                            {getFormattedTimestamp(todo.completed)}
                        </p>
                    </section>
                {/if}
            </section>
        {/if}
    </section>
</section>
