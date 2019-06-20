import { Rect, newRect } from "../types/math/rect";

export default function isVisible(elm: HTMLElement, viewport_?: Rect): boolean {
    const bbox = elm.getBoundingClientRect();
    const viewport = viewport_ || newRect(0, 0, innerWidth, innerHeight);

    return (
        bbox.top < viewport.height &&
        bbox.top + bbox.height > viewport.y &&
        bbox.left < viewport.width &&
        bbox.left + bbox.width > viewport.x
    );
}