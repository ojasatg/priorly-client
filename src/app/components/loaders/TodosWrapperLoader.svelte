<script>
    import TodoItemLoader from "./TodoItemLoader.svelte";
</script>

<section>
    <section class="grid grid-cols-3 gap-2">
        {#each Array(6) as id}
            <TodoItemLoader {id} />
        {/each}
    </section>
</section>
