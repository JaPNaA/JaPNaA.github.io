import Hexagon from "../Hexagon";
import siteResources from "../../../../core/siteResources";
import SiteConfig from "../../../../SiteConfig";
import HexagonSystem from "./HexagonSystem";

class HexagonRenderSystem extends HexagonSystem {
    private X: CanvasRenderingContext2D;
    private hexagonImg: HTMLImageElement;
    private hexagonImgPrerender: HTMLCanvasElement;

    constructor(hexagons: Hexagon[], X: CanvasRenderingContext2D) {
        super(hexagons);
        const resource = siteResources.loadImage(SiteConfig.path.img.hexagon);
        this.X = X;
        this.hexagonImg = resource.data;
        this.hexagonImgPrerender = document.createElement("canvas");

        resource.onLoad(() => {
            this.prerenderHexagon(Hexagon.baseWidth, Hexagon.baseHeight);
        });
    }

    private prerenderHexagon(width: number, height: number) {
        const X = this.hexagonImgPrerender.getContext("2d")!;
        this.hexagonImgPrerender.width = width;
        this.hexagonImgPrerender.height = height;
        X.drawImage(this.hexagonImg, 0, 0, width, height);
    }

    public run(): void {
        this.X.clearRect(0, 0, this.width, this.height);

        for (const hexagon of this.hexagons) {
            const angle = hexagon.rotation * Hexagon.rotationMax;

            this.X.save();
            this.X.translate(hexagon.x, hexagon.y);
            this.X.rotate(angle);

            this.X.drawImage(
                this.hexagonImgPrerender,
                -hexagon.width / 2, -hexagon.height / 2,
                hexagon.width, hexagon.height
            );

            // draw fading, creates effect of shadow staying down
            this.X.globalAlpha = hexagon.rotation;
            this.X.rotate(-Hexagon.rotationMax);
            this.X.drawImage(
                this.hexagonImgPrerender,
                -hexagon.width / 2, -hexagon.height / 2,
                hexagon.width, hexagon.height
            );

            this.X.restore();
        }
    }
}

export default HexagonRenderSystem;