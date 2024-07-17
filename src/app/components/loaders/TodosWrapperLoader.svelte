<script>
    import TodoItemLoader from "./TodoItemLoader.svelte";

    export let _class = "";
</script>

<section>
    <section class="grid grid-cols-3 gap-2 {_class}">
        {#each Array(6) as id}
            <TodoItemLoader {id} />
        {/each}
    </section>
</section>
