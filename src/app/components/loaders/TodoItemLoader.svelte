<script lang="ts">
    export let id = 0;
</script>

<section
    id={`todo-item-${id}`}
    class="card h-fit w-80 rounded-md border border-gray-200 bg-white px-4 pb-4 pt-2"
>
    <header class="mt-2 flex items-center justify-between gap-2">
        <div class="skeleton h-8 flex-grow p-0"></div>
        <div class="skeleton h-8 w-8 rounded-full p-0"></div>
    </header>

    <section class="my-4 grid gap-2">
        <section class="skeleton h-4 w-full" />
        <section class="skeleton h-4 w-[50%]" />
        <section class="skeleton h-4 w-[25%]" />
    </section>

    <section class="card-footer mt-2 p-0">
        <section class="grid gap-2">
            <section class="skeleton h-3 w-full" />
            <section class="skeleton h-3 w-[50%]" />
        </section>
        <hr class="my-2" />
        <section class="grid gap-2">
            <section class="skeleton h-3 w-full" />
            <section class="skeleton h-3 w-[50%]" />
        </section>
    </section>
</section>
