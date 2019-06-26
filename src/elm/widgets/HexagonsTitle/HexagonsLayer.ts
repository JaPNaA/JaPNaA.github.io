import siteConfig from "../../../SiteConfig";
import Hexagon from "./Hexagon";
import HexagonsTitle from "./HexagonsTitle";

class HexagonsLayer {
    private hexagons: Hexagon[];

    constructor(hexagonsTitle: HexagonsTitle, index: number) {
        this.hexagons = [];

        for (let i = 0; i < siteConfig.hexagonsTitle.hexagonsPerLayer; i++) {
            this.hexagons.push(new Hexagon(hexagonsTitle, index));
        }
    }

    public draw(X: CanvasRenderingContext2D) {
        for (const hexagon of this.hexagons) {
            hexagon.draw(X);
        }
    }
}

export default HexagonsLayer;