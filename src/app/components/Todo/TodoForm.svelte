<script lang="ts">
    // node imports
    import { createEventDispatcher } from "svelte";
    import { Button, CheckboxGroup, DatePicker, Input, TextArea } from "stwui";
    import tooltip from "stwui/actions/tooltip";
    import { createForm } from "felte";

    // lib imports
    import { getTimestampFromDate } from "$lib/utils";

    // local imports
    import {
        CreateTodoFormSchema,
        type TCreateTodoResponseSchema,
        type TEditTodoResponseSchema,
        type TTodoItemViewSchema,
    } from "$schemas";
    import todoService from "$services/todo.service";
    import { ETodoFormType } from "$constants/todo.consts";

    // props
    export let todo: TTodoItemViewSchema | undefined = undefined;
    export let formType: ETodoFormType;

    // events
    const dispatchEvent = createEventDispatcher<{
        create: TCreateTodoResponseSchema;
        update: TEditTodoResponseSchema;
        cancel: null;
        close: null;
    }>();

    // local variables
    let title = todo?.title ?? "";
    let description = todo?.description ?? "";

    // This needs to be rectified so that the date object can show the date properly
    let deadline: Date | undefined = todo?.deadline ? new Date(todo.deadline * 1000) : undefined;
    let reminder: Date | undefined = todo?.reminder ? new Date(todo.reminder * 1000) : undefined;
    let reminderFieldErrors = "";
    let deadlineFieldErrors = "";

    let isDone = todo?.isDone ?? false;
    let submitting = false;

    function validateDeadlineReminder(deadline?: Date, reminder?: Date) {
        // Some manual validation because date time component is not working correctly
        const deadlineTimestamp = deadline
            ? getTimestampFromDate(deadline)
            : getTimestampFromDate(new Date());
        const reminderTimestamp = reminder
            ? getTimestampFromDate(reminder)
            : getTimestampFromDate(new Date());

        const today = new Date();
        const todayTimestamp = getTimestampFromDate(today);

        if (deadlineTimestamp <= todayTimestamp) {
            deadlineFieldErrors = "Deadline cannot be lesser than today's date";
        } else if (reminderTimestamp <= todayTimestamp) {
            reminderFieldErrors = "Reminder cannot be lesser than current date and time";
        } else if (reminderTimestamp > deadlineTimestamp) {
            reminderFieldErrors = "Reminder cannot be after the Deadline";
        } else {
            deadlineFieldErrors = "";
            reminderFieldErrors = "";
        }
    }

    // local consts
    const { form: addTodoForm, errors: addTodoFormErrors } = createForm({
        // extend: validator({ schema: CreateTodoFormSchema }), - automatic validation
        validate: (values) => {
            // custom validation
            const result = CreateTodoFormSchema.safeParse(values);

            const errors = result.error?.formErrors.fieldErrors || {};

            if (deadlineFieldErrors) {
                errors["deadline"] = [deadlineFieldErrors];
            }

            if (reminderFieldErrors) {
                errors["reminder"] = [reminderFieldErrors];
            }

            return errors;
        },
        onSubmit: async () => {
            submitting = true;
            if (formType === ETodoFormType.ADD) {
                const responseData = await createTodo();
                return responseData;
            } else {
                const responseData = await updateTodo();
                return responseData;
            }
        },
        onSuccess: (response) => {
            submitting = false;
            resetValues();
            if (formType === ETodoFormType.ADD) {
                dispatchEvent("create", response as TCreateTodoResponseSchema);
            } else {
                dispatchEvent("update", response as TEditTodoResponseSchema);
            }
            dispatchEvent("close");
        },
        onError() {
            submitting = false;
        },
    });

    // local functions
    function resetValues() {
        title = "";
        description = "";
        isDone = false;
        deadline = undefined;
        reminder = undefined;
    }

    function onCancel() {
        dispatchEvent("cancel");
    }

    async function createTodo() {
        const deadlineTimestamp = deadline ? getTimestampFromDate(deadline) : undefined;
        const reminderTimestamp = reminder ? getTimestampFromDate(reminder) : undefined;

        const newTodo = {
            title: title.trim(),
            description: description?.trim() ?? "",
            isDone: isDone ?? false,
            deadline: deadlineTimestamp,
            reminder: reminderTimestamp,
        };

        // if the execution is success then we are guaranteed to have this data otherwise the errors are handled by the service itself
        const responseData = (await todoService.create({
            requestData: newTodo,
            showAlerts: true,
        })) as TCreateTodoResponseSchema;

        return responseData;
    }

    async function updateTodo() {
        const todoId = todo?.id as string; // guarnteed value
        const deadlineTimestamp = deadline ? getTimestampFromDate(deadline) : undefined;
        const reminderTimestamp = reminder ? getTimestampFromDate(reminder) : undefined;

        const changes = {
            title,
            description,
            isDone,
            deadline: deadlineTimestamp,
            reminder: reminderTimestamp,
        };

        const responseData = await todoService.edit({
            queryParams: { id: todoId },
            requestData: { changes },
            showAlerts: true,
        });

        return responseData;
    }

    // reactive statements
    $: validateDeadlineReminder(deadline, reminder);
</script>

<form use:addTodoForm>
    <section class="grid gap-4">
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
                <CheckboxGroup.Checkbox name="isDone" value="isDone" bind:checked={isDone}>
                    <CheckboxGroup.Checkbox.Label slot="label" class="label-medium"
                        >Mark as done</CheckboxGroup.Checkbox.Label
                    >
                </CheckboxGroup.Checkbox>
            </CheckboxGroup>

            {#if !isDone}
                <DatePicker
                    name="deadline"
                    label="Deadline"
                    placeholder="Pick a Deadline"
                    bind:value={deadline}
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
                                    content: "Set a deadline in your Google Calendar",
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
                    placeholder="Add a reminder"
                    bind:value={reminder}
                    error={$addTodoFormErrors.reminder?.[0]}
                    showTime
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
            <Button on:click={onCancel} size="sm">
                <span class="body-medium">Cancel</span>
            </Button>
            {#if formType === ETodoFormType.ADD}
                <Button loading={submitting} type="primary" htmlType="submit" size="sm">
                    <span class="body-medium">Add</span>
                </Button>
            {:else}
                <Button loading={submitting} type="primary" htmlType="submit" size="sm">
                    <span class="body-medium">Save</span>
                </Button>
            {/if}
        </section>
    </section>
</form>
