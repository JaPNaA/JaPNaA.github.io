export default function removeChildren(elm: Node): void {
    while (elm.firstChild) {
        elm.removeChild(elm.firstChild);
    }
}