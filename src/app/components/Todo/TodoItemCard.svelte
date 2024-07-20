<script lang="ts">
    // node imports
    import { createEventDispatcher } from "svelte";
    import { slide } from "svelte/transition";
    import { Button, Dropdown } from "stwui";
    import tooltip from "stwui/actions/tooltip";

    // lib imports
    import PRDivider from "$lib/components/PRDivider.svelte";
    import PRPrompt from "$lib/components/PRPrompt.svelte";
    import {
        getFormattedTimestamp,
        getDaysDifferenceFromTimestamp,
        getCurrentTimeDifferenceInText,
        cn,
    } from "$lib/utils";

    // local imports
    import {
        TODO_ITEM_MENU_ITEMS,
        ETodoItemMenuKeys,
        ETodoToggleType,
    } from "$constants/todo.consts";
    import { type TTodoItemViewSchema } from "$schemas";

    const CUSTOM_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
    };

    export let todo: TTodoItemViewSchema;
    export let selectionMode = false;

    let showDeletePrompt = false;
    let showMenu = false;
    let showColorPalette = false;

    const daysRemainingFromDeadline = getDaysDifferenceFromTimestamp(todo.deadline ?? 0);

    const dispatchEvent = createEventDispatcher<{
        delete: { id: string };
        toggle: { id: string; action: ETodoToggleType };
        update: { id: string };
    }>();

    function onDelete() {
        dispatchEvent("delete", { id: todo.id });
    }

    function togglePin() {
        dispatchEvent("toggle", { id: todo.id, action: ETodoToggleType.PIN });
    }

    function toggleDone() {
        dispatchEvent("toggle", { id: todo.id, action: ETodoToggleType.DONE });
    }

    function toggleSelected() {
        dispatchEvent("toggle", { id: todo.id, action: ETodoToggleType.SELECT });
        todo = todo;
    }

    function handleMenuItemClick(item: ETodoItemMenuKeys) {
        alert(item);
    }

    function updateTodo() {
        dispatchEvent("update", { id: todo.id });
    }

    function resetMenus() {
        showMenu = false;
        showColorPalette = false;
    }

    // Conditional styles
    $: selected = todo.isSelected;
    $: selectIcon =
        selected && selectionMode
            ? "i-mdi-check-circle text-primary"
            : "i-mdi-check-circle-outline text-black";
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<section
    transition:slide
    class="todo-item-card relative h-fit w-[20rem]"
    on:mouseleave={resetMenus}
>
    <!-- Buttons or features that we don't want to get disturbed by the click on main card - uses relative positioning to place the elements -->
    <span
        use:tooltip={{
            placement: "top",
            content: selected ? "Unselect" : "Select",
            arrow: false,
            animation: "scale",
        }}
        class="hover-buttons absolute -right-2 -top-3 ml-auto w-fit rounded-full"
    >
        <input
            type="checkbox"
            bind:checked={selected}
            class="h-6 w-6 {selectIcon}"
            on:click={toggleSelected}
        />
    </span>

    {#if !(todo.isDone || selectionMode)}
        <span
            use:tooltip={{
                placement: "top",
                content: todo.isPinned ? "Unpin" : "Pin",
                arrow: false,
                animation: "scale",
            }}
            class="hover-buttons absolute right-2 top-2 w-fit"
        >
            <Button size="md" shape="circle" on:click={togglePin}>
                <span
                    slot="icon"
                    class={todo.isPinned ? "i-mdi-pin-off h-8 w-8" : "i-mdi-pin-outline h-8 w-8"}
                >
                </span>
            </Button>
        </span>
    {/if}

    <button
        id={`todo-item-card-${todo.id}`}
        on:click={selectionMode ? toggleSelected : updateTodo}
        class="card todo-item-card-btn h-fit w-80 cursor-default rounded-md border-2 bg-surface px-4 pb-12 pt-2 text-left hover:shadow-lg hover:shadow-gray-300 {cn(
            {
                'border-primary': selected && selectionMode,
            },
        )}"
    >
        {#if !!todo.title}
            <p
                class="card-header title-medium mr-8 flex flex-grow items-start p-0"
                class:line-through={todo.isDone}
            >
                {todo.title}
            </p>
        {/if}
        {#if !!todo.description}
            <p
                class="w-72 overflow-hidden text-ellipsis whitespace-nowrap text-wrap {cn({
                    'body-medium': todo.description.length > 30,
                    'body-large': todo.description.length <= 30,
                })}"
            >
                {todo.description}
            </p>
        {/if}
        <section class="card-footer mt-2 p-0">
            <section class="flex items-end">
                <section>
                    <p class="label-medium inline text-gray-600">Created</p>
                    <p class="label-medium inline text-gray-900">
                        {getCurrentTimeDifferenceInText(todo.createdOn)}
                    </p>
                    <section />
                    <p class="label-medium inline text-gray-600">Edited</p>
                    <p class="label-medium inline text-gray-900">
                        {getCurrentTimeDifferenceInText(todo.updatedOn)}
                    </p>
                </section>
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
                            class={cn("card-footer flex w-fit items-center gap-1 p-0", {
                                "text-error": daysRemainingFromDeadline < 7,
                            })}
                        >
                            <span class="i-mdi-clock-alert-outline" />
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
    </button>

    <!-- Buttons or features that we don't want to get disturbed by the click on main card - uses relative positioning to place the elements -->
    {#if !selectionMode}
        <section class="hover-buttons absolute bottom-2 left-2">
            <span
                use:tooltip={{
                    placement: "top",
                    content: todo.isDone ? "Mark todo as not done" : "Mark todo as done",
                    arrow: false,
                    animation: "scale",
                }}
                class="ml-auto"
            >
                <Button size="sm" shape="circle" on:click={toggleDone}>
                    <span
                        slot="icon"
                        class="h-4 w-4 {cn({
                            'i-mdi-checkbox-marked-circle-minus-outline text-error': todo.isDone,
                            'i-mdi-checkbox-marked-circle-plus-outline text-success': !todo.isDone,
                        })}"
                    />
                </Button>
            </span>

            <span
                use:tooltip={{
                    placement: "top",
                    content: "Delete",
                    arrow: false,
                    animation: "scale",
                }}
            >
                <Button
                    size="sm"
                    shape="circle"
                    on:click={todo.isDone ? onDelete : () => (showDeletePrompt = true)}
                >
                    <span slot="icon" class="i-carbon-trash-can h-4 w-4 text-error" />
                </Button>
            </span>

            <Dropdown bind:visible={showColorPalette}>
                <span
                    use:tooltip={{
                        placement: "top",
                        content: "Add color",
                        arrow: false,
                        animation: "scale",
                    }}
                    class="w-fit"
                    slot="trigger"
                >
                    <Button
                        size="sm"
                        shape="circle"
                        on:click={() => (showColorPalette = !showColorPalette)}
                    >
                        <span slot="icon" class="i-mdi-palette-outline h-4 w-4" />
                    </Button>
                </span>
                <Dropdown.Items slot="items" class="flex gap-2">
                    <Dropdown.Items.Item label="Item 1" />
                    <Dropdown.Items.Item label="Item 2" />
                    <Dropdown.Items.Item label="Item 3" />
                </Dropdown.Items>
            </Dropdown>
        </section>

        <Dropdown bind:visible={showMenu} class="absolute bottom-2 right-2">
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
                <button
                    class="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
                    on:click={() => {
                        showMenu = !showMenu;
                    }}
                >
                    <span class="hover-buttons i-mdi-dots-vertical"> </span>
                </button>
            </span>
            <Dropdown.Items slot="items">
                {#each TODO_ITEM_MENU_ITEMS as menuItem}
                    <!-- hide priortiy option for done items -->
                    {#if !(todo.isDone && menuItem.key === ETodoItemMenuKeys.EDIT_PRIORIY)}
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
    {/if}
</section>

<PRPrompt
    bind:model={showDeletePrompt}
    title="Delete Todo?"
    message="This todo will be deleted"
    note="This operation is irreversible"
    type="error"
    submitText="Delete"
    cancelText="Cancel"
    on:submit={onDelete}
/>

<style lang="scss">
    .hover-buttons {
        display: none;
    }
    .todo-item-card:hover {
        .hover-buttons {
            display: block;
        }
    }
</style>
