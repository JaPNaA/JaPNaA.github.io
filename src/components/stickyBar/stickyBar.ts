import removeChildren from "../../utils/removeChildren";

class StickyBar {
    private elm: HTMLDivElement;

    private text: HTMLDivElement;

    constructor() {
        this.elm = document.createElement("div");
        this.elm.classList.add("stickyBar");

        this.text = document.createElement("div");
        this.text.classList.add("text");

        this.elm.appendChild(this.text);
    }

    public appendTo(parent: HTMLElement): void {
        parent.appendChild(this.elm);
    }

    public setText(elm: HTMLElement): void {
        removeChildren(this.text);
        this.text.appendChild(elm);
    }
}

export default StickyBar;