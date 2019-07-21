import siteResources from "../../../../core/siteResources";
import siteConfig from "../../../../SiteConfig";

class HexagonPrerender {
    public canvas: HTMLCanvasElement;
    public width: number;
    public height: number;
    public hue: number;

    private static hexagonBaseHue: number = 149; // todo: move to siteconfig

    constructor(width: number, height: number, hue: number) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width = width;
        this.canvas.height = this.height = height;
        this.hue = hue;
    }

    public async prerender(): Promise<void> {
        const X = this.getContext2d();
        const hexagon = await siteResources.loadImagePromise(siteConfig.path.img.hexagon);

        X.save();
        X.filter = "hue-rotate(" + (this.hue - HexagonPrerender.hexagonBaseHue) + "deg)";
        X.drawImage(
            hexagon,
            0, 0, hexagon.width, hexagon.height,
            0, 0, this.width, this.height
        );
        X.restore();
    }

    private getContext2d(): CanvasRenderingContext2D {
        const X = this.canvas.getContext("2d");
        if (!X) { throw new Error("Canvas not supported"); }
        return X;
    }
}

export default HexagonPrerender;