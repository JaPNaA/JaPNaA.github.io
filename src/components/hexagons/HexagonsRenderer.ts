import Hexagon from "./Hexagon";
import HexagonRenderSystem from "./HexagonRenderSystem";
import HexagonPrerender from "./HexagonPrerender";
import LazyCanvasRenderer from "../canvas/renderer/lazyCanvasRenderer";
import IApp from "../../core/types/app/IApp";
import HexagonLayer from "./HexagonLayer";
import siteConfig from "../../SiteConfig";
import HexagonType from "./HexagonType";

abstract class HexagonsRenderer extends LazyCanvasRenderer {
    protected hexagonLayers: HexagonLayer[];
    protected renderSystem: HexagonRenderSystem;
    protected autoClearOnDraw: boolean = true;

    private prerender: HexagonPrerender;

    private justScrolled = false;
    private scrollTop: number;

    constructor(
        app: IApp,
        hexagonType: HexagonType,
        hue?: number
    ) {
        super(app);
        this.hexagonLayers = this.createHexagonLayers(hexagonType);
        this.prerender = new HexagonPrerender(Hexagon.baseSize, Hexagon.baseSize, hue || Hexagon.baseHue);
        this.renderSystem = new HexagonRenderSystem(this, this.prerender, this.hexagonLayers);

        this.scrollTop = 0;

        this.prerender.prerender()
            .then(() => this.requestDraw());
    }

    public scrolled(y: number): void {
        this.justScrolled = true;
        this.scrollTop = y;
        this.drawIfShould();
    }

    protected hasChanged(): boolean {
        const justScolled = this.justScrolled;
        this.justScrolled = false;
        return justScolled;
    }

    protected draw(X: CanvasRenderingContext2D): void {
        if (this.autoClearOnDraw) {
            X.clearRect(0, 0, this.width, this.height);
        }
        this.renderSystem.render(X);
    }

    protected tick(deltaTime: number): void {
        const scrollFactor = -this.scrollTop / this.hexagonLayers.length;

        for (let i = 0; i < this.hexagonLayers.length; i++) {
            const layer = this.hexagonLayers[i];
            layer.offsetTop = i * scrollFactor;
        }
    }

    protected createHexagonLayers(hexagonType: HexagonType): HexagonLayer[] {
        const layers = [];
        for (let i = 0; i < siteConfig.hexagons.layers; i++) {
            // todo: more hexagons on lower layers
            layers[i] = this.createHexagonLayer(hexagonType, i);
        }

        return layers;
    }

    protected createHexagonLayer(hexagonType: HexagonType, z: number): HexagonLayer {
        return new HexagonLayer(hexagonType, z, siteConfig.hexagons.hexagonsPerLayer);
    }
}

export default HexagonsRenderer;