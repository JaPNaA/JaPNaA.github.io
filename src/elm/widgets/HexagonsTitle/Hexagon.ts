import siteConfig from "../../../SiteConfig";
import HexagonsTitle from "./HexagonsTitle";
import siteResources from "../../../core/siteResources";
import ImageResource from "../../../core/components/resourceLoader/resources/ImageResource";

class Hexagon {
    private static size: number = 1080;
    private static expectedNegativeHalfImgWidth: number = -Hexagon.size / 2;
    private static expectedNegativeHalfImgHeight: number = -Hexagon.size / 2;
    private static prerenderSize = 256;
    private static expectedHexagonColor: string = "rgba(0,189,114,0.65)";

    private static initalizedStatic: boolean = false;
    private static img: HTMLImageElement;
    private static imgPrerender: HTMLCanvasElement;
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
        this.scale *= ((z + 1) / siteConfig.hexagonsTitle.layers) *
            siteConfig.hexagonsTitle.hexagonsScale *
            (this.y * this.y * siteConfig.hexagonsTitle.lowPositionScaleBias + 0.5);

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
        X.drawImage(Hexagon.imgPrerender, Hexagon.negativeHalfImgWidth, Hexagon.negativeHalfImgHeight, Hexagon.size, Hexagon.size);
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
        const resource: ImageResource = siteResources.loadImage(siteConfig.path.img.hexagon);
        const img: HTMLImageElement = resource.data;

        this.imgLoaded = false;
        resource.onLoad(data => {
            this.negativeHalfImgWidth = -img.width / 2;
            this.negativeHalfImgHeight = -img.height / 2;
            this.imgLoaded = true;
            this.createPrerender(data.data);
        });

        return img;
    }

    private static createPrerender(img: HTMLImageElement): void {
        this.imgPrerender = document.createElement("canvas");
        const X = this.imgPrerender.getContext("2d")!;
        this.imgPrerender.width = this.prerenderSize;
        this.imgPrerender.height = this.prerenderSize;
        X.drawImage(img, 0, 0, this.prerenderSize, this.prerenderSize);
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

export default Hexagon;