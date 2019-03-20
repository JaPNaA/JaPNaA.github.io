import removeChildren from "../../../utils/removeChildren";
import Widget from "../widget";

class StickyBar extends Widget {
    public widgetName = "stickyBar";
    protected elm: HTMLDivElement;
    private text: HTMLDivElement;

    constructor() {
        super();

        this.elm = document.createElement("div");
        this.text = document.createElement("div");
    }

    public setup() {
        super.setup();
        this.text.classList.add("text");
        this.elm.appendChild(this.text);
    }

    public setText(elm: HTMLElement): void {
        removeChildren(this.text);
        this.text.appendChild(elm);
    }
}

export default StickyBar;