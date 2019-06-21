import SiteConfig from "../../../siteConfig";
import HexagonsTitle from "./HexagonsTitle";
import SiteResources from "../../../core/siteResources";
import ImageResource from "../../../core/components/resourceLoader/resources/image";

class Hexagon {
    private static size: number = 1080;
    private static expectedNegativeHalfImgWidth: number = -Hexagon.size / 2;
    private static expectedNegativeHalfImgHeight: number = -Hexagon.size / 2;
    private static expectedHexagonColor: string = "rgba(0,189,114,0.65)";

    private static initalizedStatic: boolean;
    private static img: HTMLImageElement;
    private static imgLoaded: boolean;
    private static negativeHalfImgWidth: number;
    private static negativeHalfImgHeight: number;

    private hexagonsTitle: HexagonsTitle;

    private scale: number;
    private x: number;
    private y: number;
    private z: number;
    private rotation: number;

    constructor(hexagonsTitle: HexagonsTitle, z: number) {
        Hexagon.initalizeStatic();
        this.hexagonsTitle = hexagonsTitle;

        this.x = Math.random();
        this.y = Math.random();
        this.z = z;
        this.rotation = Math.random();

        const size = Math.random();
        this.scale = size * 0.3 + 0.3;
        this.scale *= this.scale;
        this.scale *= this.scale;
        this.scale *= ((z + 1) / SiteConfig.hexagonsTitle.layers) *
            SiteConfig.hexagonsTitle.hexagonsScale *
            (this.y * this.y * SiteConfig.hexagonsTitle.lowPositionScaleBias + 0.5);

        this.moveIfInRadius();
    }

    public draw(X: CanvasRenderingContext2D): void {
        if (Hexagon.imgLoaded) {
            this.drawHexagonImage(X);
        } else {
            this.drawSquare(X);
        }
    }

    private drawHexagonImage(X: CanvasRenderingContext2D): void {
        X.save();
        this.transformCanvas(X);
        X.drawImage(Hexagon.img, Hexagon.negativeHalfImgWidth, Hexagon.negativeHalfImgHeight, Hexagon.size, Hexagon.size);
        X.restore();
    }

    private drawSquare(X: CanvasRenderingContext2D): void {
        X.save();
        this.transformCanvas(X);
        X.fillStyle = Hexagon.expectedHexagonColor;
        X.fillRect(
            Hexagon.expectedNegativeHalfImgWidth,
            Hexagon.expectedNegativeHalfImgHeight,
            Hexagon.size,
            Hexagon.size
        );
        X.restore();
    }

    private transformCanvas(X: CanvasRenderingContext2D): void {
        X.translate(this.x * this.hexagonsTitle.width, this.y * this.hexagonsTitle.height);
        X.rotate(this.rotation);
        X.scale(this.scale, this.scale);
    }

    private static initalizeStatic(): void {
        if (this.initalizedStatic) { return; }
        this.img = Hexagon.createImg();
        this.initalizedStatic = true;
    }

    private static createImg(): HTMLImageElement {
        const resource: ImageResource = SiteResources.loadImage(SiteConfig.path.img.hexagon);
        const img: HTMLImageElement = resource.image;

        this.imgLoaded = false;
        resource.onLoad(() => {
            this.negativeHalfImgWidth = -img.width / 2;
            this.negativeHalfImgHeight = -img.height / 2;
            this.imgLoaded = true;
        });

        return img;
    }

    private moveIfInRadius(): void {
        const dx: number = this.x - 0.5;
        const dy: number = this.y - 0.5;
        const ang: number = Math.atan2(dy, dx);

        if (Math.sqrt(dx * dx + dy * dy) < 0.2) {
            this.x += Math.cos(ang) * 0.2;
            this.y += Math.sin(ang) * 0.2;
        }
    }
}

export default Hexagon;