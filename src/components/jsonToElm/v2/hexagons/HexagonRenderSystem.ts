import HexagonPrerender from "./HexagonPrerender";
import Hexagon from "./Hexagon";
import HexagonsCornerRenderer from "./HexagonsCornerRenderer";

class HexagonRenderSystem {
    private renderer: HexagonsCornerRenderer;
    private prerender: HexagonPrerender;
    private hexagons: Hexagon[];

    constructor(renderer: HexagonsCornerRenderer, prerender: HexagonPrerender, hexagons: Hexagon[]) {
        this.renderer = renderer;
        this.prerender = prerender;
        this.hexagons = hexagons;
    }

    public render(X: CanvasRenderingContext2D): void {
        for (const hexagon of this.hexagons) {
            const x = hexagon.x * this.renderer.width;
            const y = hexagon.y * this.renderer.height - this.prerender.height;
            X.drawImage(
                this.prerender.canvas,
                x, y, 96, 96
            );
        }
    }
}

export default HexagonRenderSystem;