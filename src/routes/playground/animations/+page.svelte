<script lang="ts">
    import { fade, slide } from "svelte/transition";
    import { CheckboxGroup, Button } from "stwui";

    let show = false;

    let arr = [3, 0];
    const pushIntoArr = () => {
        arr.push(9);
        arr = arr;
    };
</script>

<CheckboxGroup class="fixed bottom-48 right-48">
    <CheckboxGroup.Checkbox name="animate" value="animate" bind:checked={show}>
        <CheckboxGroup.Checkbox.Label slot="label">Show animation</CheckboxGroup.Checkbox.Label>
    </CheckboxGroup.Checkbox>
</CheckboxGroup>

<Button class="fixed bottom-48 right-96" on:click={pushIntoArr} type="primary">Add More</Button>

{#if show}
    <section
        class="mx-auto mb-auto mt-48 grid w-96 gap-2 text-wrap bg-yellow-300 p-4 text-justify"
        transition:fade={{ delay: 250, duration: 2000, axis: "x" }}
    >
        {#each arr as a}
            <section id={a} class="h-12 w-full bg-black" transition:slide></section>
        {/each}
    </section>
{/if}
