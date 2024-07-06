<script lang="ts">
    import type { TSchemaViewTodoItem } from "$schemas/views.schemas";
    import { SchemaFormTodoItem, type TSchemaFormTodoItem } from "$schemas/forms.schemas";
    import PRInput from "$lib/components/PRInput.svelte";
    import PrTextArea from "$lib/components/PRTextArea.svelte";

    export let todo: TSchemaViewTodoItem;

    let newTodo: TSchemaFormTodoItem = {};

    let title = "";
    let description = "";
    let setDeadline = false;
    let deadline = 0;
    let done = false;
</script>

<section>
    <section>
        <PRInput name={"title"} bind:modelValue={title} label={"Title"} error={"title error"} />

        <PrTextArea
            name={"title"}
            bind:modelValue={description}
            label={"Description"}
            error={"description error"}
            rows={8}
        />
    </section>
    <section></section>
</section>
