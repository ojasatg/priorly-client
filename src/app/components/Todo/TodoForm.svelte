<script lang="ts">
    import { Button, CheckboxGroup, DatePicker, Input, TextArea, Toggle } from "stwui";
    import Icon from "@iconify/svelte";

    import type { TSchemaViewTodoItem } from "$schemas/views.schemas";
    import { SchemaFormTodoItem, type TSchemaFormTodoItem } from "$schemas/forms.schemas";

    export let todo: TSchemaViewTodoItem;

    let newTodo: TSchemaFormTodoItem = {};

    let title = "";
    let description = "";

    let deadline: Date;
    let setDeadline = false;

    let reminder: Date;
    let setReminder = false;

    let done = false;

    function logData() {
        console.log({
            title,
            description,
            deadline,
            reminder,
            done,
        });
    }
</script>

<section>
    <section>
        <Input
            name="title"
            placeholder="Enter a Title"
            bind:value={title}
            type="text"
            error=""
            allowClear
        />
        <TextArea
            name="description"
            placeholder="Add a Description"
            bind:value={description}
            type="text"
            error=""
            allowClear
        />
    </section>
    <section class="mt-4 flex flex-col gap-4">
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
                    error=""
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
                    error=""
                ></DatePicker>
            {/if}
        {/if}
    </section>
    <section class="mt-4">
        <Button type="primary" on:click={logData}>
            <Icon icon="carbon:add" width="1.25rem" />
            Add
        </Button>
    </section>
</section>
