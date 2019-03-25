import HexagonsLayer from "./hexagonsLayer";
import SiteConfig from "../../../siteConfig";
import SiteResources from "../../../siteResources";
import Widget from "../widget";

class HexagonsTitle extends Widget {
    public widgetName = "hexagonsTitle";

    public width: number;
    public height: number;
    public overSizeWidth: number;
    public overSizeHeight: number;

    protected elm: HTMLDivElement;
    protected parent: HTMLElement;

    private static initalizedStatic: boolean = false;
    private static logo: HTMLImageElement;

    private canvas: HTMLCanvasElement;
    private X: CanvasRenderingContext2D;
    private layers: HexagonsLayer[];

    private scrollDist: number;
    private gradient: CanvasGradient;
    private registeredEventHandlers: boolean;

    private totalWidth: number;
    private totalHeight: number;
    private isVertical: boolean;

    constructor(parentElm: HTMLElement) {
        super();

        HexagonsTitle.initalizeStatic();
        this.parent = parentElm;

        this.elm = document.createElement("div");

        this.width = 1280;
        this.height = 720;
        this.overSizeHeight = 0;
        this.overSizeWidth = 0;
        this.totalWidth = this.width + this.overSizeWidth;
        this.totalHeight = this.height + this.overSizeHeight;
        this.isVertical = false;

        this.canvas = this.createCanvas();
        this.X = this.createX();
        this.layers = this.createLayers();
        this.gradient = this.createGradient();

        this.scrollDist = 0;
        this.registeredEventHandlers = false;
    }

    public setup(): void {
        super.setup();

        this.elm.appendChild(this.canvas);
    }

    public registerEventHandlers(): void {
        if (this.registeredEventHandlers) { return; }

        this.scrollHandler = this.scrollHandler.bind(this);
        this.parent.addEventListener("scroll", this.scrollHandler, { passive: true });

        this.resizeHandler = this.resizeHandler.bind(this);
        addEventListener("resize", this.resizeHandler);
        this.resizeHandler();

        // POSSIBLE BUG: destory before nextDone
        SiteResources.nextDone().then(() => this.draw());

        this.registeredEventHandlers = true;
    }

    public destory(): void {
        super.destory();
        if (this.registeredEventHandlers) {
            removeEventListener("resize", this.resizeHandler);
            this.parent.removeEventListener("scroll", this.scrollHandler);
        }
    }

    public setSize(width: number, height: number): void {
        this.width = width;
        this.height = height;

        this.isVertical = height > width;

        this.elm.style.width = width + "px";
        this.elm.style.height = height + "px";

        this.totalWidth = this.canvas.width = this.width + this.overSizeWidth;
        this.totalHeight = this.canvas.height = this.height + this.overSizeHeight;

        this.gradient = this.createGradient();
    }

    public setOverSize(overSizeWidth: number, overSizeHeight: number): void {
        this.overSizeHeight = overSizeHeight;
        this.overSizeWidth = overSizeWidth;
    }

    public draw(): void {
        if (!this.isVisible()) { return; }

        const scrollFactor = -this.scrollDist / this.layers.length;

        this.X.clearRect(0, 0, this.totalWidth, this.totalHeight);
        this.X.fillStyle = this.gradient;
        this.X.fillRect(0, 0, this.width, this.height);

        if (!this.isVertical) {
            this.drawLogo();
        }

        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];

            this.X.save();
            this.X.translate(0, i * scrollFactor);
            layer.draw(this.X);
            this.X.restore();
        }

        if (this.isVertical) {
            this.drawLogo();
        }
    }

    public appendToParent(): void {
        this.parent.appendChild(this.elm);
    }

    private static initalizeStatic(): void {
        if (this.initalizedStatic) { return; }
        this.logo = HexagonsTitle.createLogoImg();
        this.initalizedStatic = true;
    }

    private static createLogoImg(): HTMLImageElement {
        const img: HTMLImageElement = document.createElement("img");
        img.src = SiteConfig.path.img.logo;
        return img;
    }

    private createCanvas(): HTMLCanvasElement {
        const canvas: HTMLCanvasElement = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        return canvas;
    }

    private createX(): CanvasRenderingContext2D {
        const X: CanvasRenderingContext2D | null = this.canvas.getContext("2d");

        if (X) {
            return X;
        } else {
            throw new Error("Browser unsupported");
        }
    }

    private createLayers(): HexagonsLayer[] {
        const layers: HexagonsLayer[] = [];

        for (let i: number = 0; i < SiteConfig.hexagonsTitle.layers; i++) {
            layers.push(new HexagonsLayer(this));
        }

        return layers;
    }

    private createGradient(): CanvasGradient {
        const gradient: CanvasGradient = this.X.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, "#c2ffe3");
        gradient.addColorStop(1, "#ffffff");
        return gradient;
    }

    private drawLogo(): void {
        this.X.drawImage(
            HexagonsTitle.logo,
            (this.width - HexagonsTitle.logo.width) / 2,
            (this.height - HexagonsTitle.logo.height) / 2
        );
    }

    private isVisible(): boolean {
        const bbox = this.elm.getBoundingClientRect();
        if (bbox.top + bbox.height > 0) {
            return true;
        } else {
            return false;
        }
    }

    private resizeHandler(): void {
        this.setSize(innerWidth, innerHeight);
        this.draw();
    }

    private scrollHandler(): void {
        if (SiteConfig.isHandheld) { return; }
        this.scrollDist = this.parent.scrollTop;
        this.draw();
    }
}

export default HexagonsTitle;