
export interface ElementData<T> {
    elm: T;
    width: number;
    height: number;
}

export function createElementData<T>(elm: T, width: number, height: number): ElementData<T> {
    return { elm: elm, width: width, height: height };
}

export interface GridElementPosition {
    x: number;
    y: number;
    width: number;
}

export function createGridElementPosition(x: number, y: number, width: number): GridElementPosition {
    return { x: x, y: y, width: width };
}