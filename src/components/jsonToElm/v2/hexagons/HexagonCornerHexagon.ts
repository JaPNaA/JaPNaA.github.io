import Hexagon from "../../../hexagons/Hexagon";
import siteConfig from "../../../../SiteConfig";

class HexagonCornerHexagon extends Hexagon {
    constructor(z: number) {
        super(z);

        while (this.isPositionInvalid()) {
            this.x = Math.random();
            this.y = Math.random();
        }

        const iy = 1 - this.y;
        this.size *=
            iy * iy * siteConfig.hexagons.positionScaleBias + 0.5;

        this.x += this.size;
        this.y -= this.size;
    }

    protected isPositionInvalid(): boolean {
        return this.y > 2 * this.x * this.x + 0.1;
    }
}

export default HexagonCornerHexagon;