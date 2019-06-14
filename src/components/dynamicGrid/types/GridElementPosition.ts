

export interface GridElementPosition {
    x: number;
    y: number;
    width: number;
}

export function createGridElementPosition(x: number, y: number, width: number): GridElementPosition {
    return { x: x, y: y, width: width };
}