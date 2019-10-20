import "../../../../styles/widgets/stickyBar.less";

import removeChildren from "../../../utils/removeChildren";
import Widget from "../../../core/widget/Widget";

class StickyBar extends Widget {
    public static widgetName = "stickyBar";
    public widgetName = StickyBar.widgetName;
    protected elm: HTMLDivElement;
    private bar: HTMLDivElement;
    private text: HTMLDivElement;
    private polyOffset: number;
    private polyFixed: boolean;

    private static supportsStyleSticky: boolean = StickyBar.checkSupportsStyleSticky();

    constructor() {
        super();

        this.elm = document.createElement("div");
        this.bar = document.createElement("div");
        this.text = document.createElement("div");
        this.polyOffset = 0;
        this.polyFixed = false;
    }

    public setup() {
        super.setup();
        this.text.classList.add("text");
        this.bar.classList.add("bar");
        this.bar.appendChild(this.text);
        this.elm.appendChild(this.bar);

        if (!StickyBar.supportsStyleSticky) {
            this.elm.classList.add("poly");
            this.useStickyPolyfill();
        }
    }

    public destory() {
        super.destory();
        if (!StickyBar.supportsStyleSticky) {
            this.destoryStickyPolyfill();
        }
    }

    public setTitle(bar: HTMLElement): void {
        removeChildren(this.text);
        this.text.appendChild(bar);
    }

    public appendTo(parent: HTMLElement) {
        this.destoryStickyPolyfill();
        super.appendTo(parent);
        if (!StickyBar.supportsStyleSticky) {
            this.useStickyPolyfill();
        }
    }

    private static checkSupportsStyleSticky(): boolean {
        return CSS.supports("position", "sticky") ||
            CSS.supports("position", "-webkit-sticky");
    }

    private useStickyPolyfill() {
        if (!this.parent) { return; }
        this.stickyPolyfillScrollHandler = this.stickyPolyfillScrollHandler.bind(this);
        this.parent.addEventListener("scroll", this.stickyPolyfillScrollHandler);
    }

    private destoryStickyPolyfill() {
        if (!this.parent) { return; }
        this.parent.removeEventListener("scroll", this.stickyPolyfillScrollHandler);
    }

    private stickyPolyfillScrollHandler() {
        if (!this.parent) { return; }
        if (!this.polyFixed) {
            this.polyOffset = this.bar.offsetTop;
        }

        if (this.polyOffset < this.parent.scrollTop) {
            this.elm.classList.add("polyFixed");
            this.polyFixed = true;
        } else {
            this.elm.classList.remove("polyFixed");
            this.polyFixed = false;
        }
    }
}

export default StickyBar;