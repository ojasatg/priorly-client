<script lang="ts">
    // node imports
    import { createEventDispatcher } from "svelte";
    import { slide } from "svelte/transition";
    import { Button, CheckboxGroup, DatePicker, Input, TextArea } from "stwui";
    import tooltip from "stwui/actions/tooltip";
    import { createForm } from "felte";
    import _ from "lodash";

    // lib imports
    import { getTimestampFromDate } from "$lib/utils";

    // local imports
    import {
        CreateTodoFormSchema,
        type TCreateTodoResponseSchema,
        type TEditTodoChangesSchema,
        type TEditTodoResponseSchema,
        type TTodoItemViewSchema,
    } from "$schemas";
    import todoService from "$services/todo.service";

    import { validateDeadlineReminder } from "$utils/datetime.utils";

    // props
    export let todo: TTodoItemViewSchema;
    export let _class = "";

    // events
    const dispatchEvent = createEventDispatcher<{
        create: TCreateTodoResponseSchema;
        update: TEditTodoResponseSchema;
        cancel: null;
        close: null;
    }>();

    // local variables
    let title = todo.title ?? "";
    let description = todo.description ?? "";

    let deadline: Date | undefined = todo.deadline ? new Date(todo.deadline * 1000) : undefined;
    let reminder: Date | undefined = todo.reminder ? new Date(todo.reminder * 1000) : undefined;
    let reminderFieldErrors = "";
    let deadlineFieldErrors = "";

    let isDone = todo.isDone ?? false;
    let isPinned = todo.isPinned ?? false;

    let submitting = false;

    // local consts
    const todoForm = createForm({
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

            if (!_.isEmpty(errors)) {
                console.error("Form errors: ", errors);
            }
            return errors;
        },
        onSubmit: async () => {
            if (!title && !description) {
                return;
            }

            submitting = true;

            const responseData = await updateTodo();
            return responseData;
        },
        onSuccess: (response) => {
            submitting = false;
            resetValues();
            dispatchEvent("update", response as TEditTodoResponseSchema);
            dispatchEvent("close");
        },
        onError() {
            submitting = false;
        },
    });
    const {
        form: updateTodoForm,
        errors: addTodoFormErrors,
        setErrors: setTodoFormErrors,
    } = todoForm;
    // local functions
    function resetValues() {
        title = "";
        description = "";
        isDone = false;
        isPinned = false;
        deadline = undefined;
        reminder = undefined;
    }

    function onCancel() {
        dispatchEvent("cancel");
    }

    async function updateTodo() {
        const todoId = todo.id as string; // guarnteed value
        const deadlineTimestamp = deadline ? getTimestampFromDate(deadline) : undefined;
        const reminderTimestamp = reminder ? getTimestampFromDate(reminder) : undefined;

        const changes: TEditTodoChangesSchema = {
            title,
            description,
            isDone,
            isPinned,
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

    function setDateErrors(deadline?: Date, reminder?: Date) {
        const { deadlineErrors, reminderErrors } = validateDeadlineReminder(deadline, reminder);
        deadlineFieldErrors = deadlineErrors;
        reminderFieldErrors = reminderErrors;
    }

    // reactive statements
    $: setDateErrors(deadline, reminder);
    $: setTodoFormErrors("deadline", [deadlineFieldErrors]);
    $: setTodoFormErrors("reminder", [reminderFieldErrors]);
</script>

<form id="update-todo-form" use:updateTodoForm class="mx-auto grid gap-4 {_class} rounded-md p-4">
    <section class="flex items-center gap-2">
        <Input
            name="title"
            placeholder="Enter a title"
            bind:value={title}
            type="text"
            error={$addTodoFormErrors.title?.[0]}
            class="w-full flex-grow"
        />

        {#if !isDone}
            <span
                use:tooltip={{
                    placement: "top",
                    content: isPinned ? "Unpin" : "Pin",
                    arrow: false,
                    animation: "scale",
                }}
                transition:slide
                class="w-fit"
            >
                <Button size="lg" shape="circle" on:click={() => (isPinned = !isPinned)}>
                    <span
                        slot="icon"
                        class={isPinned ? "i-mdi-pin-off h-12 w-12" : "i-mdi-pin-outline h-12 w-12"}
                    >
                    </span>
                </Button>
            </span>
        {/if}
    </section>

    <TextArea
        name="description"
        placeholder="Add a description"
        bind:value={description}
        type="text"
        error={$addTodoFormErrors.description?.[0]}
    >
        <p slot="label" class="label-medium">Description</p>
    </TextArea>
    <section class="my-2 grid gap-4">
        <section class="flex items-center gap-8">
            <CheckboxGroup>
                <CheckboxGroup.Checkbox name="isDone" value="isDone" bind:checked={isDone}>
                    <CheckboxGroup.Checkbox.Label slot="label" class="label-medium"
                        >Mark as done</CheckboxGroup.Checkbox.Label
                    >
                </CheckboxGroup.Checkbox>
            </CheckboxGroup>
        </section>

        {#if !isDone}
            <section transition:slide class="grid w-full grid-cols-2 gap-2">
                <DatePicker
                    name="deadline"
                    label="Deadline"
                    placeholder="Pick a deadline"
                    bind:value={deadline}
                    min={new Date()}
                    error={$addTodoFormErrors.deadline?.[0]}
                >
                    <DatePicker.Label slot="label">
                        <section class="flex items-center gap-2">
                            <p class="body-small">Deadline</p>
                            <span
                                class="i-mdi-information-outline h-4 w-4 text-primary"
                                use:tooltip={{
                                    placement: "right",
                                    content: "Set a deadline in your Google calendar",
                                    arrow: false,
                                    animation: "scale",
                                }}
                            >
                            </span>
                        </section>
                    </DatePicker.Label></DatePicker
                >

                <DatePicker
                    name="reminder"
                    label="Reminder"
                    placeholder="Add a reminder"
                    bind:value={reminder}
                    showTime
                    min={new Date()}
                    error={$addTodoFormErrors.reminder?.[0]}
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
            </section>
        {/if}
    </section>
    <section class="ml-auto mt-2 w-fit">
        <Button on:click={onCancel} size="sm">
            <span class="body-medium">Cancel</span>
        </Button>

        <Button loading={submitting} type="primary" htmlType="submit" size="sm">
            <span class="body-medium">Save</span>
        </Button>
    </section>
</form>
