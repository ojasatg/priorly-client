import { writable, derived, get } from "svelte/store";
import _ from "lodash";

import type { TTodoItemViewSchema } from "$schemas";

const useTodoStore = () => {
    // Will be easier to perform operations here
    const selectedTodos = writable<TTodoItemViewSchema[]>([]);

    // Functionalities overlap but purposefully kept separated
    function toggleTodoSelection(todo: TTodoItemViewSchema) {
        todo.isSelected = !todo.isSelected;
        if (todo.isSelected) {
            selectedTodos.update((prev) => [...prev, todo]);
        } else {
            const todos = get(selectedTodos);
            _.remove(todos, { id: todo.id });
            selectedTodos.update(() => todos);
        }
    }

    const selectionMode = derived(selectedTodos, ($a) => $a.length > 0);

    return {
        selectedTodos,
        selectionMode,
        toggleTodoSelection,
    };
};

export const { selectedTodos, selectionMode, toggleTodoSelection } = useTodoStore();
