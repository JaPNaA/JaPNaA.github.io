import HexagonPrerender from "./HexagonPrerender";
import Hexagon from "./Hexagon";
import HexagonLayer from "./HexagonLayer";
import LazyCanvasRenderer from "../canvas/renderer/lazyCanvasRenderer";

class HexagonRenderSystem {
    private cx: number;
    private cy: number;

    constructor(
        private renderer: LazyCanvasRenderer,
        private prerender: HexagonPrerender,
        private hexagonLayers: HexagonLayer[]
    ) {
        this.cx = 0;
        this.cy = 0;
    }

    public setCenter(x: number, y: number) {
        this.cx = x;
        this.cy = y;
    }

    public render(X: CanvasRenderingContext2D): void {
        const scaleFactor = Math.max(innerWidth, innerHeight) / Hexagon.baseSize;

        for (const layer of this.hexagonLayers) {
            X.globalAlpha = layer.opacity;

            if (layer.scale !== 1) {
                X.translate(this.cx, this.cy);
                X.scale(layer.scale, layer.scale);
                X.translate(-this.cx, layer.offsetTop - this.cy);
            } else {
                X.translate(0, layer.offsetTop);
            }

            for (const hexagon of layer.hexagons) {
                const scale = hexagon.size * scaleFactor;
                X.save();

                X.translate(
                    hexagon.x * this.renderer.width,
                    hexagon.y * this.renderer.height
                );
                X.rotate(hexagon.rotation);
                X.scale(scale, scale);

                X.drawImage(
                    this.prerender.canvas,
                    Hexagon.negHalfBaseSize,
                    Hexagon.negHalfBaseSize,
                    Hexagon.baseSize,
                    Hexagon.baseSize
                );

                X.restore();
            }

            this.renderer.resetTransform();
        }

        X.globalAlpha = 1;
    }

    public renderPlaceholders(X: CanvasRenderingContext2D): void {
        X.fillStyle = Hexagon.expectedHexagonColor;

        for (const layer of this.hexagonLayers) {
            for (const hexagon of layer.hexagons) {
                X.save();

                X.translate(
                    hexagon.x * this.renderer.width,
                    hexagon.y * this.renderer.height
                );
                X.rotate(hexagon.rotation);
                X.scale(hexagon.size, hexagon.size);

                X.fillRect(
                    Hexagon.negHalfBaseSize,
                    Hexagon.negHalfBaseSize,
                    Hexagon.baseSize,
                    Hexagon.baseSize
                );

                X.restore();
            }
        }
    }
}

export default HexagonRenderSystem;