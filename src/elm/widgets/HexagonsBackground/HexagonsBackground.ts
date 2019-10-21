import Widget from "../../../core/widget/Widget";
import IApp from "../../../core/types/app/IApp";
import Hexagon from "./Hexagon";
import HexagonSystems from "./systems/HexagonSystems";

class HexagonsBackground extends Widget {
    public static cssName = "hexagonsBackground";
    public cssName = HexagonsBackground.cssName;

    protected elm: HTMLCanvasElement;

    private app: IApp;
    private systems: HexagonSystems;

    private hexagons: Hexagon[];
    private width: number;
    private height: number;

    constructor(app: IApp) {
        super();
        this.elm = document.createElement("canvas");
        this.app = app;

        this.hexagons = [];
        this.width = 0;
        this.height = 0;

        this.systems = new HexagonSystems(this.hexagons, this.getX());
    }

    public setup(): void {
        super.setup();

        this.reqanf();
        this.addEventHandlers();
        this.resizeHandler();
        this.createHexagons();
    }

    private getX(): CanvasRenderingContext2D {
        const X = this.elm.getContext("2d");
        if (!X) { throw new Error("Canvas not supported"); }
        return X;
    }

    private addEventHandlers(): void {
        this.resizeHandler = this.resizeHandler.bind(this);
        this.app.events.onResize(this.resizeHandler);
    }

    private resizeHandler(): void {
        this.elm.width = this.width = this.app.width;
        this.elm.height = this.height = this.app.height;
        this.systems.resize(this.width, this.height);
    }

    private reqanf(): void {
        this.draw();
        requestAnimationFrame(() => this.reqanf());
    }

    private draw(): void {
        this.systems.run();
    }

    private createHexagons(): void {
        for (let i = 0; i < 100; i++) {
            this.hexagons.push(new Hexagon(
                this.width, this.height
            ));
        }
    }
}

export default HexagonsBackground;