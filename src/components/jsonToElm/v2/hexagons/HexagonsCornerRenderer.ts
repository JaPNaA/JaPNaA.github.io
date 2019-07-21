import LazyCanvasRenderer from "../../../canvas/renderer/lazyCanvasRenderer";
import HexagonRenderSystem from "./HexagonRenderSystem";
import IApp from "../../../../core/types/app/IApp";
import HexagonPrerender from "./HexagonPrerender";
import Hexagon from "./Hexagon";

class HexagonsCornerRenderer extends LazyCanvasRenderer {
    public renderSystem: HexagonRenderSystem;
    public prerender: HexagonPrerender;

    private static widthBreakpoint = 576;

    constructor(app: IApp, hue: number, hexagons: Hexagon[]) {
        super(app);
        this.prerender = new HexagonPrerender(96, 96, hue);
        this.renderSystem = new HexagonRenderSystem(this, this.prerender, hexagons);
        this.prerender.prerender()
            .then(() => this.requestDraw());
    }

    protected hasChanged(): boolean {
        return false;
    }

    protected getNewSize(): [number, number] {
        let width = innerWidth / 3;
        if (width < HexagonsCornerRenderer.widthBreakpoint) {
            if (innerWidth > HexagonsCornerRenderer.widthBreakpoint) {
                width = HexagonsCornerRenderer.widthBreakpoint;
            } else {
                width = innerWidth;
            }
        }

        return [width, innerHeight];
    }

    protected draw(X: CanvasRenderingContext2D): void {
        this.renderSystem.render(X);
    }

    protected tick(deltaTime: number): void { }
}

export default HexagonsCornerRenderer;