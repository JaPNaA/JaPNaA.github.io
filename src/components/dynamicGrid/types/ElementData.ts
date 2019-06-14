export interface ElementData<T> {
    elm: T;
    width: number;
    height: number;
}

export function createElementData<T>(elm: T, width: number, height: number): ElementData<T> {
    return { elm: elm, width: width, height: height };
}