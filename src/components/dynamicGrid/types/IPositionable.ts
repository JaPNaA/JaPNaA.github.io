import { Rect } from "../../../types/math/Rect";

export default interface IPositionable {
    setRect(rect: Rect): void;
    getClientRect(): Rect;
}