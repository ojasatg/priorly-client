<script>
    import TodoItemLoader from "./TodoItemLoader.svelte";

    export let classNames = "";
</script>

<section>
    <section class="grid grid-cols-3 gap-2 {classNames}">
        {#each Array(6) as id}
            <TodoItemLoader {id} />
        {/each}
    </section>
</section>
