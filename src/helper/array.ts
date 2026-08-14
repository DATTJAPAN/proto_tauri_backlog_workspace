export function h_array_length(value: unknown | null): number | null {
    if (Array.isArray(value)) {
        return value?.length
    }

    return null;
}