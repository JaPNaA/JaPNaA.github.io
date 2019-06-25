import { Rect } from "../../../types/math/Rect";

export interface ElementData<T> {
    elm: T;
    width: number;
    height: number;
    rect?: Rect;
}

export function createElementData<T>(elm: T, width: number, height: number): ElementData<T> {
    return { elm: elm, width: width, height: height };
}