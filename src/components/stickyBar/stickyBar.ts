import "../../../styles/components/stickyBar/stickyBar.less";

class StickyBar {
    private elm: HTMLDivElement;

    constructor() {
        this.elm = document.createElement("div");
        this.elm.classList.add("stickyBar");
        this.elm.innerText = "hi";
    }

    public appendTo(parent: HTMLElement) {
        parent.appendChild(this.elm);
    }
}

export default StickyBar;