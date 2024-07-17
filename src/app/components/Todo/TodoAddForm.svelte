<script lang="ts">
    // node imports
    import { createEventDispatcher, onMount } from "svelte";
    import { slide } from "svelte/transition";
    import { Button, DatePicker, Input, TextArea } from "stwui";
    import tooltip from "stwui/actions/tooltip";
    import { createForm } from "felte";
    import _ from "lodash";

    // lib imports
    import { getTimestampFromDate } from "$lib/utils";

    // local imports
    import {
        CreateTodoFormSchema,
        type TCreateTodoResponseSchema,
        type TEditTodoResponseSchema,
    } from "$schemas";
    import todoService from "$services/todo.service";
    import { validateDeadlineReminder } from "$utils/datetime.utils";

    // props
    export let _class = "";

    // events
    const dispatchEvent = createEventDispatcher<{
        create: TCreateTodoResponseSchema;
        update: TEditTodoResponseSchema;
        cancel: null;
        close: null;
    }>();

    // local variables
    let title = "";
    let description = "";

    let deadline: Date | undefined;
    let reminder: Date | undefined;
    let reminderFieldErrors = "";
    let deadlineFieldErrors = "";

    let isPinned = false;
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
            const responseData = await createTodo();
            return responseData;
        },
        onSuccess: (response) => {
            submitting = false;
            resetValues();
            dispatchEvent("create", response as TCreateTodoResponseSchema);
            dispatchEvent("close");
        },
        onError() {
            submitting = false;
        },
    });
    const { form: addTodoForm, errors: addTodoFormErrors, setErrors: setTodoFormErrors } = todoForm;
    // local functions
    function resetValues() {
        title = "";
        description = "";
        isPinned = false;
        deadline = undefined;
        reminder = undefined;
    }

    async function createTodo() {
        const deadlineTimestamp = deadline ? getTimestampFromDate(deadline) : undefined;
        const reminderTimestamp = reminder ? getTimestampFromDate(reminder) : undefined;

        const newTodo = {
            title: title.trim(),
            description: description?.trim() ?? "",
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

    function detectKeyDowns(event: KeyboardEvent) {
        if (event.key === "Escape") {
            resetValues();
        }
    }

    function handleClickOutsideForm(event: MouseEvent) {
        if (!(event.target as HTMLElement)?.closest("#add-todo-form")) {
            // if clicked outside of the form
            todoForm.handleSubmit();
        }
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
    $: showDetails = !!title || !!description || !!deadline || !!reminder;

    onMount(() => {
        document?.addEventListener("click", handleClickOutsideForm, false);
    });
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<form
    id="add-todo-form"
    use:addTodoForm
    class="grid gap-4 {_class} rounded-md p-4"
    class:shadow-lg={showDetails}
    class:bg-white={showDetails}
    on:keydown={detectKeyDowns}
>
    <section class="flex items-center gap-2">
        <Input
            name="title"
            placeholder="Add a todo..."
            bind:value={title}
            type="text"
            error={$addTodoFormErrors.title?.[0]}
            class="w-full flex-grow"
        />

        {#if showDetails}
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
    {#if showDetails}
        <section transition:slide={{ duration: 500 }}>
            <TextArea
                name="description"
                id="todo-create-form-description"
                placeholder="Add a description"
                bind:value={description}
                type="text"
                error={$addTodoFormErrors.description?.[0]}
            >
                <p slot="label" class="label-medium">Description</p>
            </TextArea>

            <section transition:slide class="mt-4 grid w-full grid-cols-2 gap-2">
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

            <section class="ml-auto mt-2 w-fit">
                <Button on:click={resetValues} size="sm">
                    <span class="body-medium">Cancel</span>
                </Button>

                <Button loading={submitting} type="primary" htmlType="submit" size="sm">
                    <span class="body-medium">Add</span>
                </Button>
            </section>
        </section>
    {/if}
</form>
