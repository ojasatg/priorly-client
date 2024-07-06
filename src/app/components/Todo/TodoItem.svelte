<script lang="ts">
    import { type TSchemaViewTodoItem } from "../../schemas/views.schemas";
    import { getFormattedTimestamp } from "$lib/utils/formatters.utils";

    export let todo: TSchemaViewTodoItem;
</script>

<section>
    <section class="card w-[20rem] bg-white px-4 pb-4 pt-2">
        <p class="title-medium card-header p-0">{todo.title}</p>
        <p class="body-medium my-4 text-wrap">{todo.description}</p>
        <section class="card-footer p-0">
            <p class="label-medium inline text-gray-400">Created at</p>
            <p class="label-medium inline">{getFormattedTimestamp(todo.deadline)}</p>
        </section>
    </section>
</section>
