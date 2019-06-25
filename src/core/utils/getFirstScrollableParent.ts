export default function getFirstScrollableParent(elm: HTMLElement): HTMLElement | null {
    let curr = elm;

    while (curr.parentElement) {
        curr = curr.parentElement;

        if (elm.scrollHeight > elm.clientHeight) {
            curr;
        }
    }

    return null;
}