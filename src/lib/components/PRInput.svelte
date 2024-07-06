<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "@iconify/svelte";

    import type { THTMLInputEvent } from "$lib/types/event.types";

    export let modelValue: string;
    export let name = "";
    export let label = "";
    export let error = "";

    const dispatch = createEventDispatcher<{ updateModelValue: null }>();

    function dispatchUpdateModelValue() {
        dispatch("updateModelValue");
    }

    function onInputChange(event: THTMLInputEvent) {
        if (!event.target) {
            return;
        }

        const { value } = event.target as HTMLInputElement;
        modelValue = value;

        dispatchUpdateModelValue();
    }
</script>

<section>
    <div class="priorly-input">
        <input
            on:input={onInputChange}
            {name}
            value={modelValue}
            placeholder=" "
            class="input p-2"
        />
        <label for={name}>{label}</label>
    </div>

    {#if error}
        <div class="mt-1 flex items-center gap-1">
            <Icon icon="carbon:warning" class="text-error" height="1rem" width="1rem" />
            <span class="body-small text-error">{error}</span>
        </div>
    {/if}
</section>

<style scoped lang="scss">
    .priorly-input {
        position: relative;

        input {
            transition: 0.1s var(--main-ease);
        }
        :focus {
            outline: none;
            border: 1px solid rgb(var(--primary));
        }

        label {
            position: absolute;
            top: 50%;
            left: 0.5rem;
            transform: translateY(-50%);
            text-align: center;
            transition: 0.2s var(--main-ease);
            font-size: var(--font-body-size);
            color: rgb(161, 161, 161);
            pointer-events: none;
            padding: 0 5px;
        }
    }

    .priorly-input input:not(:placeholder-shown) ~ label,
    .priorly-input input:focus ~ label {
        top: -0.75rem;
        left: 0px;
        font-size: 1rem;
        font-size: var(--font-label-size);
        color: rgb(var(--primary));
    }
</style>
