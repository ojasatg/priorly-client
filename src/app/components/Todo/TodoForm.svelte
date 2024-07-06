<script lang="ts">
    // node imports
    import { Button, CheckboxGroup, DatePicker, Input, TextArea, Toggle } from "stwui";
    import type { SafeParseReturnType } from "zod";

    // local imports
    import type { TTodoResponseSchema } from "$schemas/response.schemas";
    import { AddTodoReuestSchema, type TAddTodoReuestSchema } from "$schemas/request.schemas";

    // props
    export let todo: TTodoResponseSchema;

    // local consts

    // local variables
    let title = todo.title ?? "";
    let description = todo.description ?? "";

    let deadline: Date | undefined = todo?.deadline ? new Date(todo.deadline * 1000) : undefined;
    let setDeadline = false;

    let reminder: Date | undefined = todo?.reminder ? new Date(todo.reminder * 1000) : undefined;
    let setReminder = false;

    let done = false;

    let addTodoValidationResult: SafeParseReturnType<TAddTodoReuestSchema, TAddTodoReuestSchema>;

    // local functions
    function resetValues() {
        title = "";
        description = "";
        done = false;
        deadline = undefined;
        reminder = undefined;
    }

    function onAdd() {
        const newTodo = {
            title,
            description,
            done,
            reminder: reminder ? reminder?.getTime() / 1000 : undefined,
            deadline: deadline ? deadline?.getTime() / 1000 : undefined,
        };
        addTodoValidationResult = AddTodoReuestSchema.safeParse(newTodo);
        resetValues();
    }
</script>

<section class="flex flex-col gap-4 bg-white p-4">
    <section class="flex flex-col gap-2">
        <Input
            name="title"
            placeholder="Enter a Title"
            bind:value={title}
            type="text"
            error={addTodoValidationResult?.error?.formErrors?.fieldErrors?.title?.[0]}
            allowClear
        />
        <TextArea
            name="description"
            placeholder="Add a Description"
            bind:value={description}
            type="text"
            error={addTodoValidationResult?.error?.formErrors?.fieldErrors?.description?.[0]}
            allowClear
        />
    </section>
    <section class="flex flex-col gap-4">
        <CheckboxGroup>
            <CheckboxGroup.Checkbox name="done" value="done" bind:checked={done}>
                <CheckboxGroup.Checkbox.Label slot="label" class="label-medium"
                    >Mark as done</CheckboxGroup.Checkbox.Label
                >
            </CheckboxGroup.Checkbox>
        </CheckboxGroup>

        {#if !done}
            <Toggle bind:on={setDeadline}>
                <Toggle.ContentLeft slot="content-left">
                    <Toggle.ContentLeft.Label slot="label" class="label-medium ml-1"
                        >Deadline</Toggle.ContentLeft.Label
                    >
                </Toggle.ContentLeft>
            </Toggle>
            {#if setDeadline}<DatePicker
                    name="date"
                    label="Date"
                    placeholder="Pick a Deadline"
                    bind:value={deadline}
                    error={addTodoValidationResult?.error?.formErrors?.fieldErrors?.deadline?.[0]}
                ></DatePicker>
            {/if}

            <Toggle bind:on={setReminder}>
                <Toggle.ContentLeft slot="content-left">
                    <Toggle.ContentLeft.Label slot="label" class="label-medium ml-1"
                        >Reminder</Toggle.ContentLeft.Label
                    >
                </Toggle.ContentLeft>
            </Toggle>
            {#if setReminder}<DatePicker
                    name="date"
                    label="Date"
                    placeholder="Add a Reminder"
                    bind:value={reminder}
                    error={addTodoValidationResult?.error?.formErrors?.fieldErrors?.reminder?.[0]}
                ></DatePicker>
            {/if}
        {/if}
    </section>
    <section class="ml-auto w-fit">
        <Button on:click={onAdd} size="sm" class="text-gray-600">
            <span slot="leading" class="i-mdi-cancel h-6 w-6"></span>
            <span class="body-medium">Cancel</span>
        </Button>
        <Button type="primary" on:click={onAdd} size="sm">
            <span slot="leading" class="i-mdi-plus h-6 w-6"></span>
            <span class="body-medium">Add</span>
        </Button>
    </section>
</section>
