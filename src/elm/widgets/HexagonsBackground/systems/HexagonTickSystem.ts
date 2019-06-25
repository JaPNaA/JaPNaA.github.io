import HexagonSystem from "./HexagonSystem";
import Hexagon from "../Hexagon";

class HexagonTickSystem extends HexagonSystem {
    constructor(hexagons: Hexagon[]) {
        super(hexagons);
    }

    public resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    public run(): void {
        const boundWidth = this.width + Hexagon.baseWidth;
        const boundHeight = this.height + Hexagon.baseHeight;
        const boundLeft = -Hexagon.baseWidth;
        const boundTop = -Hexagon.baseHeight;

        for (const hexagon of this.hexagons) {
            hexagon.x += hexagon.vx;
            hexagon.y += hexagon.vy;

            if (hexagon.x > boundWidth) {
                hexagon.x = boundLeft;
            } else if (hexagon.x < boundLeft) {
                hexagon.x = boundWidth;
            }
            if (hexagon.y > boundHeight) {
                hexagon.y = boundTop;
            } else if (hexagon.y < boundTop) {
                hexagon.y = boundHeight;
            }
        }
    }
}

export default HexagonTickSystem;