import "../../../../../styles/widgets/hexagonsCorner.less";

import HexagonsCornerRenderer from "./HexagonsCornerRenderer";
import IApp from "../../../../core/types/app/IApp";
import Widget from "../../../../core/widget/Widget";
import HexagonCornerHexagon from "./HexagonCornerHexagon";

class HexagonsCorner extends Widget {
    public static widgetName: string = "hexagonsCorner";
    public widgetName = HexagonsCorner.widgetName;

    protected elm: HTMLElement;

    private scrollableParent: HTMLElement;
    private renderer: HexagonsCornerRenderer;
    private app: IApp;

    constructor(app: IApp, scrollableParent: HTMLElement, hue: number) {
        super();
        this.app = app;
        this.scrollableParent = scrollableParent;

        this.elm = this.createElm();
        this.renderer = new HexagonsCornerRenderer(app, HexagonCornerHexagon, hue);
    }

    public setup(): void {
        super.setup();

        this.renderer.appendTo(this.elm);
        this.renderer.requestDraw();

        this.addEventHandlers();
    }

    public destory(): void {
        super.destory();
        this.renderer.destory();
        this.app.events.offResize(this.resizeHandler);
        this.scrollableParent.removeEventListener("scroll", this.scrollHandler);
    }

    private addEventHandlers(): void {
        this.resizeHandler = this.resizeHandler.bind(this);
        this.app.events.onResize(this.resizeHandler);

        this.scrollHandler = this.scrollHandler.bind(this);
        this.scrollableParent.addEventListener("scroll", this.scrollHandler);
    }

    private resizeHandler(): void {
        this.renderer.updateSize();
    }

    private scrollHandler(): void {
        this.renderer.scrolled(this.scrollableParent.scrollTop);
    }

    private createElm(): HTMLDivElement {
        const elm = document.createElement("div");
        elm.classList.add("HexagonsCorner")
        return elm;
    }
}

export default HexagonsCorner;