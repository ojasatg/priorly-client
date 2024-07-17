export function generateRandomDOMId() {
    return "_" + Math.random().toString(36).substr(2, 9);
}

export function appendPlural(label: string, count: number) {
    if (count > 1) {
        return label + "s";
    }
    return label;
}
