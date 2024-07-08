<script lang="ts">
    // node imports
    import { createEventDispatcher } from "svelte";
    import { Button, CheckboxGroup, DatePicker, Input, TextArea } from "stwui";
    import tooltip from "stwui/actions/tooltip";
    import { createForm } from "felte";
    import { validator } from "@felte/validator-zod";

    // lib imports
    import { alerts } from "$lib/stores/alertStore";

    // local imports
    import type { TTodoAddResponseSchema } from "$schemas/response.schemas";
    import { TodoAddFormSchema, type TTodoAddFormSchema } from "$schemas/form.schemas";
    import { useTodoCreate } from "$services/todo.service";
    import type { TAPISuccess } from "$types/api.types";
    import { getTimestampFromDate } from "$lib/utils/datetime.utils";

    // props
    export let todo: TTodoAddResponseSchema;

    // events
    const dispatchEvent = createEventDispatcher<{
        cancel: null;
        close: null;
    }>();

    // reactive statements
    // as soon as deadline or reminder changes, if deadline is there check that reminder is not greater than the deadline

    // local consts
    const {
        form: addTodoForm,
        errors: addTodoFormErrors,
        setErrors: setAddTodoFormErrors,
    } = createForm({
        extend: validator({ schema: TodoAddFormSchema }),
        validate: (values) => {
            const result = TodoAddFormSchema.safeParse(values);

            if (!result.success) {
                return result.error.formErrors.fieldErrors;
            }
        },
        onSubmit: async (values: TTodoAddFormSchema) => {
            submitting = true;

            const deadlineTimestamp = deadline ? getTimestampFromDate(deadline) : undefined;
            const reminderTimestamp = reminder ? getTimestampFromDate(reminder) : undefined;

            const newTodo = {
                ...values,
                deadline: deadlineTimestamp,
                reminder: reminderTimestamp,
            };

            const response = await useTodoCreate({ requestData: newTodo });
            return response;
        },
        onSuccess: (response) => {
            const typedResponse = response as TAPISuccess<TTodoAddResponseSchema>;
            alerts.success(typedResponse.message);
            submitting = false;
            resetValues();
            dispatchEvent("close");
        },
        onError(error) {
            submitting = false;
            alerts.success(error as string);
        },
    });

    // local variables
    let title = todo.title ?? "";
    let description = todo.description ?? "";

    // This needs to be rectified so that the date object can show the date properly
    let deadline: Date | undefined = todo?.deadline ? new Date(todo.deadline * 1000) : undefined;
    let reminder: Date | undefined = todo?.reminder ? new Date(todo.reminder * 1000) : undefined;

    let done = todo.done ?? false;
    let submitting = false;

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

<form use:addTodoForm>
    <section class="grid gap-4 bg-surface">
        <section class="grid gap-2">
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
        <section class="mb-2 grid gap-4">
            <CheckboxGroup>
                <CheckboxGroup.Checkbox name="done" value="done" bind:checked={done}>
                    <CheckboxGroup.Checkbox.Label slot="label" class="label-medium"
                        >Mark as done</CheckboxGroup.Checkbox.Label
                    >
                </CheckboxGroup.Checkbox>
            </CheckboxGroup>

            {#if !done}
                <DatePicker
                    name="deadline"
                    label="Deadline"
                    placeholder="Pick a Deadline"
                    bind:value={deadline}
                    min={new Date()}
                    error={$addTodoFormErrors.deadline?.[0]}
                    allowClear
                >
                    <DatePicker.Label slot="label">
                        <section class="flex items-center gap-2">
                            <p class="body-small">Deadline</p>
                            <span
                                class="i-mdi-information-outline h-4 w-4 text-primary"
                                use:tooltip={{
                                    placement: "right",
                                    content: "Set a Deadline in your Google Calendar",
                                    arrow: false,
                                    animation: "scale",
                                }}
                            >
                            </span>
                        </section>
                        <section class="flex w-full items-center gap-2"></section>
                    </DatePicker.Label></DatePicker
                >

                <DatePicker
                    name="reminder"
                    label="Reminder"
                    placeholder="Add a Reminder"
                    bind:value={reminder}
                    min={new Date()}
                    max={deadline}
                    error={$addTodoFormErrors.reminder?.[0]}
                    allowClear
                    class="flex-auto"
                >
                    <DatePicker.Label slot="label">
                        <section class="flex items-center gap-2">
                            <p class="body-small">Reminder</p>
                            <span
                                class="i-mdi-information-outline h-4 w-4 text-primary"
                                use:tooltip={{
                                    placement: "right",
                                    content: "Add a Reminder in your Google Calendar",
                                    arrow: false,
                                    animation: "scale",
                                }}
                            >
                            </span>
                        </section>
                    </DatePicker.Label></DatePicker
                >
            {/if}
        </section>
        <section class="ml-auto w-fit">
            <Button on:click={onCancel} size="sm" class="text-gray-600">
                <span slot="leading" class="i-mdi-cancel h-6 w-6"></span>
                <span class="body-medium">Cancel</span>
            </Button>
            <Button loading={submitting} type="primary" htmlType="submit" size="sm">
                <span slot="leading" class="i-mdi-plus h-6 w-6"></span>
                <span class="body-medium">Add</span>
            </Button>
        </section>
    </section>
</form>
