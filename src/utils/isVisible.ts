export default function isVisible(elm: HTMLElement): boolean {
    const bbox = elm.getBoundingClientRect();
    return (
        bbox.top < innerHeight &&
        bbox.top + bbox.height > 0 &&
        bbox.left < innerWidth &&
        bbox.left + bbox.width > 0
    );
}