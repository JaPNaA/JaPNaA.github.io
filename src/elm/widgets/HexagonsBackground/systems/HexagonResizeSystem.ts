import Hexagon from "../Hexagon";
import HexagonSystem from "./HexagonSystem";

class HexagonResizeSystem extends HexagonSystem {
    private prevHeight: number;
    private prevWidth: number;

    constructor(hexagons: Hexagon[]) {
        super(hexagons);
        this.prevHeight = -1;
        this.prevWidth = -1;
    }

    public run(): void {
        if (
            this.width !== this.prevWidth && this.prevWidth > 0
        ) {
            for (const hexagon of this.hexagons) {
                hexagon.x = hexagon.x / this.prevWidth * this.width;
            }
        }

        if (
            this.height !== this.prevHeight && this.prevHeight > 0
        ) {
            for (const hexagon of this.hexagons) {
                hexagon.y = hexagon.y / this.prevHeight * this.height;
            }
        }

        this.prevHeight = this.height;
        this.prevWidth = this.width;
    }
}

export default HexagonResizeSystem;