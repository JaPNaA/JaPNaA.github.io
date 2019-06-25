export default function getLink(elm: any): string | null {
    if (!(elm instanceof Element)) { return null; }

    let curr: Element | null = elm;

    while (true) {
        if (curr) {
            if (curr.tagName === "A" && 'href' in curr) {
                return (curr as HTMLAnchorElement).href;
            } else {
                curr = curr.parentElement;
            }
        } else {
            return null;
        }
    }
}