import Hexagon from "../Hexagon";
import siteResources from "../../../../core/siteResources";
import SiteConfig from "../../../../SiteConfig";
import HexagonSystem from "./HexagonSystem";

class HexagonRenderSystem extends HexagonSystem {
    private X: CanvasRenderingContext2D;
    private hexagonImg: HTMLImageElement;

    constructor(hexagons: Hexagon[], X: CanvasRenderingContext2D) {
        super(hexagons);
        this.X = X;
        this.hexagonImg = siteResources.loadImage(SiteConfig.path.img.hexagon).data;
    }

    public run(): void {
        this.X.clearRect(0, 0, this.width, this.height);
        for (const hexagon of this.hexagons) {
            this.X.save();
            this.X.translate(hexagon.x, hexagon.y);
            this.X.rotate(hexagon.rotation);
            this.X.drawImage(
                this.hexagonImg,
                -hexagon.width / 2, -hexagon.height / 2,
                hexagon.width, hexagon.height
            );
            this.X.restore();
        }
    }
}

export default HexagonRenderSystem;