import { Dim } from "./dim";
import { Vec2 } from "./vec2";

export interface Rect extends Dim, Vec2 { };

function newRect(): Rect;
function newRect(x: number, y: number, width: number, height: number): Rect;
function newRect(x?: number, y?: number, width?: number, height?: number): Rect {
    return { x: x || 0, y: y || 0, width: width || 0, height: height || 0 };
}

export { newRect };