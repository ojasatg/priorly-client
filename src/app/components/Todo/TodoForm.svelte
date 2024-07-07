<script lang="ts">
    // node imports
    import { createEventDispatcher } from "svelte";
    import { Button, CheckboxGroup, DatePicker, Input, TextArea, Toggle } from "stwui";
    import tooltip from "stwui/actions/tooltip";
    import { createForm } from "felte";
    import { validator } from "@felte/validator-zod";

    // lib imports
    import { useAlertStore } from "$lib/stores/alertStore";

    // local imports
    import type { TTodoAddResponseSchema } from "$schemas/response.schemas";
    import { TodoAddRequestSchema, type TTodoAddRequestSchema } from "$schemas/request.schemas";

    // props
    export let todo: TTodoAddResponseSchema;

    // events
    const dispatchEvent = createEventDispatcher<{
        add: TTodoAddRequestSchema;
        cancel: null;
        close: null;
    }>();

    // stores
    const alert = useAlertStore();

    // local consts
    const { form: addTodoForm, errors: addTodoFormErrors } = createForm({
        extend: validator({ schema: TodoAddRequestSchema }),
        validate: (values) => {
            const result = TodoAddRequestSchema.safeParse(values);

            if (!result.success) {
                return result.error.formErrors.fieldErrors;
            }
        },
        onSubmit: (values) => {
            dispatchEvent("add", values);
        },
        onSuccess: (response) => {
            console.log(response);

            alert.showAlert();

            console.log($alert);

            resetValues();
            // dispatchEvent("close");
        },
    });

    // local variables
    let title = todo.title ?? "";
    let description = todo.description ?? "";

    let deadline: Date | undefined = todo?.deadline ? new Date(todo.deadline * 1000) : undefined;
    let setDeadline = false;

    let reminder: Date | undefined = todo?.reminder ? new Date(todo.reminder * 1000) : undefined;
    let setReminder = false;

    let done = todo.done ?? false;

    // local functions
    function resetValues() {
        title = "";
        description = "";
        done = false;
        deadline = undefined;
        reminder = undefined;
    }

    function onCancel() {
        dispatchEvent("cancel");
    }
</script>

<section class="flex flex-col gap-4 bg-surface">
    <form use:addTodoForm>
        <section class="flex flex-col gap-2">
            <Input
                name="title"
                placeholder="Enter a Title"
                bind:value={title}
                type="text"
                error={$addTodoFormErrors.title?.[0]}
                allowClear
            />
            <TextArea
                name="description"
                placeholder="Add a Description"
                bind:value={description}
                type="text"
                error={$addTodoFormErrors.description?.[0]}
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
                        error={$addTodoFormErrors.deadline?.[0]}
                    ></DatePicker>
                {/if}

                <section class="flex items-center gap-2">
                    <Toggle bind:on={setReminder}>
                        <Toggle.ContentLeft slot="content-left">
                            <Toggle.ContentLeft.Label slot="label" class="label-medium ml-1"
                                >Reminder</Toggle.ContentLeft.Label
                            >
                        </Toggle.ContentLeft>
                    </Toggle>
                    <span
                        class="i-mdi-information-outline h-5 w-5 text-primary"
                        use:tooltip={{
                            placement: "right",
                            content: "Set a Reminder in your Google Calendar",
                            arrow: false,
                            animation: "scale",
                        }}
                    >
                    </span>
                </section>
                {#if setReminder}<DatePicker
                        name="date"
                        label="Date"
                        placeholder="Add a Reminder"
                        bind:value={reminder}
                        error={$addTodoFormErrors.reminder?.[0]}
                    ></DatePicker>
                {/if}
            {/if}
        </section>
        <section class="ml-auto w-fit">
            <Button on:click={onCancel} size="sm" class="text-gray-600">
                <span slot="leading" class="i-mdi-cancel h-6 w-6"></span>
                <span class="body-medium">Cancel</span>
            </Button>
            <Button type="primary" htmlType="submit" size="sm">
                <span slot="leading" class="i-mdi-plus h-6 w-6"></span>
                <span class="body-medium">Add</span>
            </Button>
        </section>
    </form>
</section>
