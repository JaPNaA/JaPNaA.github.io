import { isArrayEqual } from "./isArrayEqual";
import deepEquals from "./deepEquals";

type IterableObject = { [x: string]: any };

export function isIterableObjectEqual<T extends object>(a: T, b: T): boolean {
    const keysA = Object.keys(a).sort();
    const keysB = Object.keys(b).sort();

    if (!isArrayEqual(keysA, keysB)) {
        return false;
    }

    for (const key of keysA) {
        if (
            (a as IterableObject)[key] !==
            (b as IterableObject)[key]
        ) {
            return false;
        }
    }

    return true;
}

export function isIterableObjectEqualDeep<T extends object>(a: T, b: T): boolean {
    if (a === b) { return true; }

    const keysA = Object.keys(a).sort();
    const keysB = Object.keys(b).sort();

    if (!isArrayEqual(keysA, keysB)) {
        return false;
    }

    for (const key of keysA) {
        if (!deepEquals(
            (a as IterableObject)[key],
            (b as IterableObject)[key]
        )) {
            return false;
        }
    }

    return true;
}