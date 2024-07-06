<script lang="ts">
    // node imports
    import { Button } from "stwui";
    import { getIcon } from "@iconify/svelte";

    // local imports
    import { type TTodoResponseSchema } from "$schemas/response.schemas";
    import { getFormattedTimestamp } from "$lib/utils/datetime.utils";

    export let todo: TTodoResponseSchema;

    const iconEdit = getIcon("mdi:pencil")?.body;
</script>

<section>
    <section class="card w-[20rem] rounded-md bg-white px-4 pb-4 pt-2 shadow-md shadow-gray-400">
        <div class="flex items-center justify-between">
            <p class="title-medium card-header p-0">{todo.title}</p>
            <Button shape="circle">
                <Button.Icon data={iconEdit} slot="icon" class="text-black" />
            </Button>
        </div>
        <p class="body-medium my-4 text-wrap">{todo.description}</p>
        <section class="card-footer p-0">
            <p class="label-medium inline text-gray-400">Created at</p>
            <p class="label-medium inline">{getFormattedTimestamp(todo.deadline)}</p>
        </section>
    </section>
</section>
