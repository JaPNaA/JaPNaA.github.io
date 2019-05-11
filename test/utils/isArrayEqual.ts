import { isIterableObjectEqual } from "./isIterableObjectEqual";
import deepEquals from "./deepEquals";

export function isArrayEqual<T>(a: T[], b: T[]): boolean {
    if (a.length !== b.length) { return false; }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

export function isArrayEqualDeep<T>(a: T[], b: T[]): boolean {
    if (a.length !== b.length) { return false; }
    for (let i = 0; i < a.length; i++) {
        if (!deepEquals(a[i], b[i])) {
            return false;
        }
    }
    return true;
}