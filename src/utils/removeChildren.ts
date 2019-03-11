export default function removeChildren(elm: HTMLElement): void {
    while (elm.firstChild) {
        elm.removeChild(elm.firstChild);
    }
}