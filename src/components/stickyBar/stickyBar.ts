import "../../../styles/components/stickyBar/stickyBar.less";

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

    public setText(text: string): void {
        this.text.innerHTML = text;
    }
}

export default StickyBar;