<script lang="ts">
    // node imports
    import { Button, Divider } from "stwui";
    import tooltip from "stwui/actions/tooltip";

    // local imports
    import { type TTodoResponseSchema } from "$schemas/response.schemas";
    import {
        getFormattedTimestamp,
        getDaysDifferenceFromTimestamp,
    } from "$lib/utils/datetime.utils";

    export let todo: TTodoResponseSchema;

    const daysRemainingFromDeadline = getDaysDifferenceFromTimestamp(todo.deadline);

    $: deadline_class = daysRemainingFromDeadline < 7 ? "text-error" : "text-gray-400";
</script>

<section>
    <section class="card w-[20rem] rounded-md bg-white px-4 pb-4 pt-2 shadow-md shadow-gray-400">
        <header class="flex items-center justify-between">
            <p class="title-medium card-header p-0">{todo.title}</p>
            <span
                use:tooltip={{
                    placement: "top",
                    content: "Edit",
                    arrow: false,
                    animation: "scale",
                }}
            >
                <Button shape="circle">
                    <span slot="icon" class="i-mdi-application-edit-outline"> </span>
                </Button>
            </span>
        </header>
        <p class="body-medium my-4 text-wrap">{todo.description}</p>
        <section class="card-footer mt-2 p-0">
            <section class="mb-2">
                <p class="label-medium inline text-gray-400">Created at</p>
                <p class="label-medium inline">{getFormattedTimestamp(todo.created)}</p>
            </section>

            {#if todo.reminder || todo.deadline}
                <Divider />
            {/if}

            {#if todo.reminder || todo.deadline}
                <section class="mt-4 flex flex-col gap-1">
                    {#if todo.reminder}
                        <section
                            use:tooltip={{
                                placement: "bottom-start",
                                content: "Reminder",
                                arrow: false,
                                animation: "scale",
                            }}
                            class="card-footer flex items-center gap-1 p-0 text-gray-400"
                        >
                            <span class="i-mdi-alarm"></span>
                            <p class="label-medium inline">
                                {getFormattedTimestamp(todo.reminder)}
                            </p>
                        </section>
                    {/if}
                    {#if todo.reminder}
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
                                {getFormattedTimestamp(todo.deadline, {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        </section>
                    {/if}
                </section>
            {/if}
        </section>
    </section>
</section>
