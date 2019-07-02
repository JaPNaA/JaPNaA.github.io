import HexagonSystem from "./HexagonSystem";
import Hexagon from "../Hexagon";

class HexagonTickSystem extends HexagonSystem {
    private then: number;

    constructor(hexagons: Hexagon[]) {
        super(hexagons);
        this.then = performance.now();
    }

    public resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    public run(): void {
        const now = performance.now();
        let deltaTime = (now - this.then) / 60;
        this.then = now;

        if (deltaTime > 10) {
            deltaTime = 1;
        }

        const boundWidth = this.width + Hexagon.baseWidth;
        const boundHeight = this.height + Hexagon.baseHeight;
        const boundLeft = -Hexagon.baseWidth;
        const boundTop = -Hexagon.baseHeight;

        for (const hexagon of this.hexagons) {
            hexagon.x += hexagon.vx * deltaTime;
            hexagon.y += hexagon.vy * deltaTime;
            hexagon.rotation += hexagon.vrotation * deltaTime;

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
            if (hexagon.rotation > 1) {
                hexagon.rotation %= 1;
            } else if (hexagon.rotation < 0) {
                hexagon.rotation += 1;
            }
        }
    }
}

export default HexagonTickSystem;