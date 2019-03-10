import HexagonsLayer from "./hexagonsLayer";
import SiteConfig from "../../siteConfig";

class HexagonsTitle {
    public width: number;
    public height: number;
    public overSizeWidth: number;
    public overSizeHeight: number;

    private static logo: HTMLImageElement = HexagonsTitle.createLogoImg();

    private canvas: HTMLCanvasElement;
    private X: CanvasRenderingContext2D;
    private layers: HexagonsLayer[];

    private gradient: CanvasGradient;
    private registeredEventHandlers: boolean;

    constructor() {
        this.width = 1280;
        this.height = 720;
        this.overSizeHeight = 0;
        this.overSizeWidth = 0;

        this.canvas = this.createCanvas();
        this.X = this.createX();
        this.layers = this.createLayers();
        this.gradient = this.createGradient();

        this.registeredEventHandlers = false;
    }

    public registerEventHandlers() {
        if (this.registeredEventHandlers) { return; }

        this.resizeHandler = this.resizeHandler.bind(this);
        addEventListener("resize", this.resizeHandler);
        this.resizeHandler();

        this.registeredEventHandlers = true;
    }

    public destory() {
        if (this.registeredEventHandlers) {
            removeEventListener("resize", this.resizeHandler);
        }
    }

    public setSize(width: number, height: number): void {
        this.width = width;
        this.height = height;

        this.canvas.width = this.width + this.overSizeWidth;
        this.canvas.height = this.height + this.overSizeHeight;

        this.gradient = this.createGradient();
    }

    public setOverSize(overSizeWidth: number, overSizeHeight: number): void {
        this.overSizeHeight = overSizeHeight;
        this.overSizeWidth = overSizeWidth;
    }

    public draw() {
        this.X.fillStyle = this.gradient;
        this.X.fillRect(0, 0, this.width, this.height);

        for (const layer of this.layers) {
            layer.draw(this.X);
        }

        this.X.drawImage(
            HexagonsTitle.logo,
            (this.width - HexagonsTitle.logo.width) / 2,
            (this.height - HexagonsTitle.logo.height) / 2
        );
    }

    public appendTo(parent: HTMLElement): void {
        parent.appendChild(this.canvas);
    }

    private static createLogoImg(): HTMLImageElement {
        const img = document.createElement("img");
        img.src = SiteConfig.paths.logo;
        return img;
    }

    private createCanvas(): HTMLCanvasElement {
        const canvas = document.createElement("canvas");
        canvas.classList.add("hexagonsTitle");
        canvas.width = this.width;
        canvas.height = this.height;
        return canvas;
    }

    private createX(): CanvasRenderingContext2D {
        const X = this.canvas.getContext('2d');

        if (X) {
            return X;
        } else {
            throw new Error("Browser unsupported");
        }
    }

    private createLayers(): HexagonsLayer[] {
        const layers = [];

        for (let i = 0; i < SiteConfig.hexagonsTitle.layers; i++) {
            layers.push(new HexagonsLayer(this));
        }

        return layers;
    }

    private createGradient(): CanvasGradient {
        const gradient = this.X.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, "#c2ffe3");
        gradient.addColorStop(1, "#ffffff");
        return gradient;
    }

    private resizeHandler(): void {
        this.setSize(innerWidth, innerHeight);
        this.draw();
    }
}

export default HexagonsTitle;