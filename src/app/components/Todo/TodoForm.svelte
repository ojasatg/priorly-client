<script lang="ts">
    import type { TSchemaViewTodoItem } from "$schemas/views.schemas";
    import { SchemaFormTodoItem, type TSchemaFormTodoItem } from "$schemas/forms.schemas";
    import PRInput from "$lib/components/PRInput.svelte";
    import PrTextArea from "$lib/components/PRTextArea.svelte";

    export let todo: TSchemaViewTodoItem;

    let newTodo: TSchemaFormTodoItem = {};

    let title = "";
    let description = "";
    let deadline = 0;
    let done = false;

    function logTitle() {
        console.log("title updated: ", title);
    }

    function logDescription() {
        console.log("description updated: ", description);
    }
</script>

<section>
    <PRInput
        name={"title"}
        bind:modelValue={title}
        label={"Title"}
        error={"This is an error"}
        on:updateModelValue={logTitle}
    />

    <PrTextArea
        name={"title"}
        bind:modelValue={description}
        label={"Description"}
        error={"This is an error"}
        rows={8}
        on:updateModelValue={logDescription}
    />
</section>
