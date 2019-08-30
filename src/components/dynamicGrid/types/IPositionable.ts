import { Rect } from "../../../types/math/Rect";

export default interface IPositionable {
    setRect(rect: Rect): void;
    getRect(): Rect;
}