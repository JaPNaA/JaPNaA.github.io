import Hexagon from "../../../components/hexagons/Hexagon";
import siteConfig from "../../../SiteConfig";

class HexagonTitleHexagon extends Hexagon {
    constructor(z: number) {
        super(z);
        this.moveIfInRadius();
        this.y *= 1 - this.size;
        this.size *=
            this.y * this.y * siteConfig.hexagons.positionScaleBias + 0.5;
    }

    private moveIfInRadius(): void {
        const dist = 0.225;
        const dx: number = this.x - 0.5;
        const dy: number = this.y - 0.5;
        const ang: number = Math.atan2(dy, dx);

        if (Math.sqrt(dx * dx + dy * dy) < dist) {
            this.x += Math.cos(ang) * dist;
            this.y += Math.sin(ang) * dist;
        }
    }
}

export default HexagonTitleHexagon;