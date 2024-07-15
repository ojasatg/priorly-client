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
    import { slide } from "svelte/transition";
    import _ from "lodash";

    // props
    export let todo: TTodoItemViewSchema | undefined = undefined;
    export let formType: ETodoFormType;
    export let classNames = "";

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

    let deadline: Date | undefined = todo?.deadline ? new Date(todo.deadline * 1000) : undefined;
    let reminder: Date | undefined = todo?.reminder ? new Date(todo.reminder * 1000) : undefined;
    let reminderFieldErrors = "";
    let deadlineFieldErrors = "";

    let isDone = todo?.isDone ?? false;
    let isPinned = todo?.isPinned ?? false;

    let submitting = false;

    function validateDeadlineReminder(deadline?: Date, reminder?: Date) {
        // Some manual validation because date time component is not working correctly
        const deadlineTimestamp = deadline ? getTimestampFromDate(deadline) : undefined;
        const reminderTimestamp = reminder ? getTimestampFromDate(reminder) : undefined;

        const today = new Date();
        const todayTimestamp = getTimestampFromDate(today);

        if (deadlineTimestamp && deadlineTimestamp <= todayTimestamp) {
            deadlineFieldErrors = "Deadline cannot be lesser than today's date";
        } else if (reminderTimestamp && reminderTimestamp <= todayTimestamp) {
            reminderFieldErrors = "Reminder cannot be lesser than current date and time";
        } else if (
            deadlineTimestamp &&
            reminderTimestamp &&
            reminderTimestamp > deadlineTimestamp
        ) {
            reminderFieldErrors = "Reminder cannot be after the Deadline";
        } else {
            deadlineFieldErrors = "";
            reminderFieldErrors = "";
        }
    }

    // local consts
    const {
        form: addTodoForm,
        errors: addTodoFormErrors,
        setErrors: setTodoFormErrors,
    } = createForm({
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
        isPinned = false;
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
            isPinned: isPinned ?? false,
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

    // reactive statements
    $: validateDeadlineReminder(deadline, reminder);
    $: setTodoFormErrors("deadline", [deadlineFieldErrors]);
    $: setTodoFormErrors("reminder", [reminderFieldErrors]);
</script>

<form use:addTodoForm class="grid gap-4 {classNames}">
    <section class="flex items-center gap-2">
        <Input
            name="title"
            placeholder="Add a todo..."
            bind:value={title}
            type="text"
            error={$addTodoFormErrors.title?.[0]}
            allowClear
            class="w-full flex-grow"
        />

        {#if !!title && !isDone}
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

    <!-- if title or description -->
    {#if !!title || !!description}
        <section transition:slide>
            <TextArea
                name="description"
                placeholder="Add a description"
                bind:value={description}
                type="text"
                error={$addTodoFormErrors.description?.[0]}
                allowClear
            >
                <p slot="label" class="label-medium">Description</p>
            </TextArea>
            <section class="my-2 grid gap-4">
                <section class="flex items-center gap-8">
                    {#if formType === ETodoFormType.EDIT}
                        <CheckboxGroup>
                            <CheckboxGroup.Checkbox
                                name="isDone"
                                value="isDone"
                                bind:checked={isDone}
                            >
                                <CheckboxGroup.Checkbox.Label slot="label" class="label-medium"
                                    >Mark as done</CheckboxGroup.Checkbox.Label
                                >
                            </CheckboxGroup.Checkbox>
                        </CheckboxGroup>
                    {/if}
                </section>

                {#if !isDone}
                    <section transition:slide class="grid gap-2">
                        <DatePicker
                            name="deadline"
                            label="Deadline"
                            placeholder="Pick a deadline"
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
                                            content: "Set a deadline in your Google calendar",
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
                    </section>
                {/if}
            </section>
            <section class="ml-auto mt-2 w-fit">
                <Button
                    on:click={formType === ETodoFormType.EDIT ? onCancel : () => resetValues()}
                    size="sm"
                >
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
    {/if}
</form>
