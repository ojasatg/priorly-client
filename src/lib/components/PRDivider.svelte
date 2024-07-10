<script lang="ts">
    export let text: string | undefined = undefined;
</script>

<section class="relative flex w-full items-center py-2">
    <section class="flex-grow border-t border-gray-300"></section>
    {#if text}
        <span class="label-medium mx-4 flex-shrink text-gray-300">{text}</span>
    {/if}
    <section class="flex-grow border-t border-gray-300"></section>
</section>
