import SiteConfig from "../../siteConfig";
import HexagonsTitle from "./hexagonsTitle";

class Hexagon {
    private static img: HTMLImageElement = Hexagon.createImg();
    private static negativeHalfImgWidth: number;
    private static negativeHalfImgHeight: number;

    private hexagonsTitle: HexagonsTitle;

    private scale: number;
    private x: number;
    private y: number;
    private rotation: number;

    constructor(hexagonsTitle: HexagonsTitle) {
        this.hexagonsTitle = hexagonsTitle;

        this.scale = Math.random() * 0.3 + 0.3;
        this.scale *= this.scale;
        this.scale *= this.scale;

        this.x = Math.random();
        this.y = Math.random();
        this.rotation = Math.random();

        this.moveIfInRadius();
    }

    public draw(X: CanvasRenderingContext2D): void {
        // TODO: If image not loaded, render squre instead
        X.save();

        X.translate(this.x * this.hexagonsTitle.width, this.y * this.hexagonsTitle.height);
        X.rotate(this.rotation);
        X.scale(this.scale, this.scale);

        X.drawImage(Hexagon.img, Hexagon.negativeHalfImgWidth, Hexagon.negativeHalfImgHeight);

        X.restore();
    }

    private static createImg(): HTMLImageElement {
        const img = document.createElement("img");
        img.src = SiteConfig.paths.hexagon;

        img.addEventListener("load", () => {
            this.negativeHalfImgWidth = -img.width / 2;
            this.negativeHalfImgHeight = -img.height / 2;
        });

        return img;
    }

    private moveIfInRadius() {
        const dx = this.x - 0.5;
        const dy = this.y - 0.5;
        const ang = Math.atan2(dy, dx);

        if (Math.sqrt(dx * dx + dy * dy) < 0.2) {
            this.x += Math.cos(ang) * 0.2;
            this.y += Math.sin(ang) * 0.2;
        }
    }
}

export default Hexagon;