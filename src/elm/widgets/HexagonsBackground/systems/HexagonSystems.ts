import HexagonRenderSystem from "./HexagonRenderSystem";
import HexagonTickSystem from "./HexagonTickSystem";
import Hexagon from "../Hexagon";
import HexagonSystem from "./HexagonSystem";
import HexagonResizeSystem from "./HexagonResizeSystem";

class HexagonSystems extends HexagonSystem {
    private renderSystem: HexagonRenderSystem;
    private tickSystem: HexagonTickSystem;
    private resizeSystem: HexagonResizeSystem;

    constructor(hexagons: Hexagon[], X: CanvasRenderingContext2D) {
        super(hexagons);
        this.renderSystem = new HexagonRenderSystem(hexagons, X);
        this.tickSystem = new HexagonTickSystem(hexagons);
        this.resizeSystem = new HexagonResizeSystem(hexagons);
    }

    public resize(width: number, height: number): void {
        super.resize(width, height);
        this.renderSystem.resize(width, height);
        this.tickSystem.resize(width, height);

        this.resizeSystem.resize(width, height);
        this.resizeSystem.run();
    }

    public run(): void {
        this.renderSystem.run();
        this.tickSystem.run();
    }
}

export default HexagonSystems;