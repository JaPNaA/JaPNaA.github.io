import "../../../../../styles/widgets/hexagonsCorner.less";

import Hexagon from "./Hexagon";
import HexagonsCornerRenderer from "./HexagonsCornerRenderer";
import IApp from "../../../../core/types/app/IApp";
import Widget from "../../../../core/widget/Widget";

class HexagonsCorner extends Widget {
    public static widgetName: string = "hexagonsCorner";
    public widgetName = HexagonsCorner.widgetName;

    protected elm: HTMLElement;

    private static readonly amount = 15;
    private hexagons: Hexagon[];
    private renderer: HexagonsCornerRenderer;
    private app: IApp;

    constructor(app: IApp) {
        super();
        this.app = app;
        this.elm = this.createElm();
        this.hexagons = [];
        this.renderer = new HexagonsCornerRenderer(app, this.hexagons);
        this.setup();
    }

    public setup(): void {
        super.setup();
        for (let i = 0; i < HexagonsCorner.amount; i++) {
            this.hexagons.push(new Hexagon());
        }

        this.renderer.appendTo(this.elm);
        this.renderer.requestDraw();

        this.addEventHandlers();
    }

    public destory(): void {
        super.destory();
        this.app.events.offResize(this.resizeHandler);
    }

    private addEventHandlers(): void {
        this.resizeHandler = this.resizeHandler.bind(this)
        this.app.events.onResize(this.resizeHandler);
    }

    private resizeHandler(): void {
        this.renderer.updateSize();
    }

    private createElm(): HTMLDivElement {
        const elm = document.createElement("div");
        elm.classList.add("HexagonsCorner")
        return elm;
    }
}

export default HexagonsCorner;