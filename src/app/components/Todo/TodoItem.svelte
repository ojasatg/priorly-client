<script lang="ts">
    // node imports
    import { createEventDispatcher } from "svelte";
    import { Button, Dropdown } from "stwui";
    import tooltip from "stwui/actions/tooltip";

    // lib imports
    import PRDivider from "$lib/components/PRDivider.svelte";
    import PRPrompt from "$lib/components/PRPrompt.svelte";
    import { getFormattedTimestamp, getDaysDifferenceFromTimestamp } from "$lib/utils";

    // local imports
    import { TODO_ITEM_MENU_ITEMS, ETodoItemMenuKeys } from "$constants/todo.consts";
    import { type TTodoItemViewSchema } from "$schemas";
    import _ from "lodash";

    const CUSTOM_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
    };

    export let todo: TTodoItemViewSchema;
    let deleting = false;
    let pinning = false;

    let showDeletePrompt = false;

    const daysRemainingFromDeadline = getDaysDifferenceFromTimestamp(todo.deadline ?? 0);

    const dispatchEvent = createEventDispatcher<{
        delete: {
            id: string;
            afterDeletion: () => void;
        };
        togglePin: {
            id: string;
            afterToggle: () => void;
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

    function togglePin() {
        pinning = true;
        dispatchEvent("togglePin", {
            id: todo.id,
            afterToggle: () => {
                pinning = false;
            },
        });
    }

    function handleMenuItemClick(item: ETodoItemMenuKeys) {
        alert(item);
    }

    let showMenu = false;

    $: deadline_class = daysRemainingFromDeadline < 7 ? "text-error" : "";
    $: description_font_size_class = todo.description.length <= 60 ? "body-large" : "body-medium";
    $: loading = pinning || deleting;
</script>

<section
    id={`todo-item-${todo.id}`}
    class="card h-fit w-80 cursor-default rounded-md border border-gray-200 bg-white px-4 pb-4 pt-2 text-left hover:shadow-lg hover:shadow-gray-300"
>
    <header class="card-header flex items-start">
        <p class="title-medium flex-grow p-0" class:line-through={todo.isDone}>
            {todo.title}
        </p>

        {#if !todo.isDone}
            <span
                use:tooltip={{
                    placement: "top",
                    content: todo.isPinned ? "Unpin" : "Pin",
                    arrow: false,
                    animation: "scale",
                }}
                class="ml-auto w-fit"
            >
                <Button size="sm" shape="circle" on:click={togglePin} {loading}>
                    <span slot="icon" class={todo.isPinned ? "i-mdi-pin-off" : "i-mdi-pin-outline"}>
                    </span>
                </Button>
            </span>
        {/if}
        <Dropdown bind:visible={showMenu}>
            <span
                use:tooltip={{
                    placement: "top",
                    content: "More options",
                    arrow: false,
                    animation: "scale",
                }}
                class="w-fit"
                slot="trigger"
            >
                <Button
                    size="sm"
                    shape="circle"
                    on:click={() => {
                        showMenu = !showMenu;
                    }}
                >
                    <span slot="icon" class="i-mdi-dots-vertical"> </span>
                </Button>
            </span>
            <Dropdown.Items slot="items">
                {#each TODO_ITEM_MENU_ITEMS as menuItem}
                    {#if !todo.isDone && !_.includes(menuItem.hide, "isDone")}
                        <Dropdown.Items.Item
                            on:click={() => handleMenuItemClick(menuItem.key)}
                            label={menuItem.label}
                        >
                            <span slot="icon" class="{menuItem.icon} h-4 w-4" />
                        </Dropdown.Items.Item>
                    {/if}
                {/each}
            </Dropdown.Items>
        </Dropdown>
    </header>
    <p class="my-4 text-wrap {description_font_size_class}">
        {todo.description}
    </p>
    <section class="card-footer mt-2 p-0">
        <section class="flex items-end justify-between">
            <section>
                <p class="label-medium inline text-gray-600">Created on</p>
                <p class="label-medium inline text-gray-900">
                    {getFormattedTimestamp(todo.createdOn, CUSTOM_DATE_OPTIONS)}
                </p>
                <section />
                <p class="label-medium inline text-gray-600">Last updated on</p>
                <p class="label-medium inline text-gray-900">
                    {getFormattedTimestamp(todo.updatedOn, CUSTOM_DATE_OPTIONS)}
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
                <Button
                    size="lg"
                    shape="circle"
                    class="-mb-2"
                    on:click={() => (showDeletePrompt = true)}
                    {loading}
                >
                    <span slot="icon" class="i-carbon-trash-can h-4 w-4 text-error"> </span>
                </Button>
            </span>
        </section>

        {#if todo.reminder || todo.deadline || todo.isDone}
            <PRDivider />
            <section class="grid gap-1">
                {#if todo.reminder}
                    <section
                        use:tooltip={{
                            placement: "bottom-start",
                            content: "Reminder",
                            arrow: false,
                            animation: "scale",
                        }}
                        class="card-footer flex w-fit items-center gap-1 p-0"
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
                        class="card-footer flex w-fit items-center gap-1 p-0 {deadline_class}"
                    >
                        <span class="i-mdi-clock-alert-outline"></span>
                        <p class="label-medium inline">
                            {getFormattedTimestamp(todo.deadline, CUSTOM_DATE_OPTIONS)}
                        </p>
                    </section>
                {/if}

                {#if todo.isDone}
                    <section
                        use:tooltip={{
                            placement: "bottom-start",
                            content: "You marked this item as done",
                            arrow: false,
                            animation: "scale",
                        }}
                        class="card-footer flex w-fit items-center gap-1 p-0 text-success"
                    >
                        <span class="i-mdi-checkbox-marked-circle-outline"></span>
                        <p class="label-medium inline">
                            {getFormattedTimestamp(todo.completedOn ?? 0)}
                        </p>
                    </section>
                {/if}
            </section>
        {/if}
    </section>
</section>
<PRPrompt
    bind:modelValue={showDeletePrompt}
    title="Delete Todo?"
    message="This todo will be deleted"
    note="This operation is irreversible"
    type="error"
    submitText="Delete"
    cancelText="Cancel"
    on:submit={onDelete}
/>
