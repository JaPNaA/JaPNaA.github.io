import "../../../../styles/widgets/hexagonsTitle.less";

import HexagonsLayer from "./hexagonsLayer";
import SiteConfig from "../../../siteConfig";
import SiteResources from "../../../core/siteResources";
import Widget from "../../../core/widget/widget";
import WidgetMap from "../../../core/widget/widgetMap";
import Logo from "./logo";
import HexagonsTitleRenderer from "./hexagonsTitleRenderer";
import { easeInQuad, easeInCubic, easeInOutQuad, easeInOutQuart } from "../../../utils/easingFunctions";

// TODO: Make this look better on mobile
// TODO: Make a nice transition in

class HexagonsTitle extends Widget {
    public static widgetName = "hexagonsTitle";
    public widgetName = HexagonsTitle.widgetName;

    public width: number;
    public height: number;
    public overSizeWidth: number;
    public overSizeHeight: number;

    protected elm: HTMLDivElement;
    protected parent: HTMLElement;

    private static transitionInTime = 1000;

    private renderer: HexagonsTitleRenderer;
    private logo: Logo;
    private layers: HexagonsLayer[];

    private scrollDist: number;
    private gradient: CanvasGradient;
    private registeredEventHandlers: boolean;

    private isVertical: boolean;

    private transitionInTimestep: number;

    constructor(parentElm: HTMLElement) {
        super();
        this.parent = parentElm;

        this.elm = document.createElement("div");

        this.width = 1280;
        this.height = 720;
        this.overSizeHeight = 0;
        this.overSizeWidth = 0;
        this.isVertical = false;

        this.renderer = new HexagonsTitleRenderer(this);
        this.layers = this.createLayers();
        this.gradient = this.createGradient();
        this.logo = new Logo();

        this.scrollDist = 0;
        this.transitionInTimestep = SiteConfig.isMobile ? 1 : 0;

        this.registeredEventHandlers = false;
    }

    public setup(): void {
        super.setup();
        this.renderer.appendTo(this.elm);
        this.setSize(this.renderer.width, this.renderer.height);
    }

    public registerEventHandlers(): void {
        if (this.registeredEventHandlers) { return; }

        this.scrollHandler = this.scrollHandler.bind(this);
        this.parent.addEventListener("scroll", this.scrollHandler, { passive: true });

        this.resizeHandler = this.resizeHandler.bind(this);
        addEventListener("resize", this.resizeHandler);
        this.resizeHandler();

        this.renderer.onResize((size) => this.setSize(size[0], size[1]));

        // POSSIBLE BUG: destory before nextDone
        SiteResources.nextDone().then(() => this.renderer.requestDraw());

        this.registeredEventHandlers = true;
    }

    public destory(): void {
        super.destory();
        this.renderer.destory();
        if (this.registeredEventHandlers) {
            removeEventListener("resize", this.resizeHandler);
            this.parent.removeEventListener("scroll", this.scrollHandler);
        }
    }

    public setOverSize(overSizeWidth: number, overSizeHeight: number): void {
        this.overSizeHeight = overSizeHeight;
        this.overSizeWidth = overSizeWidth;
    }

    public tick(deltaTime: number): void {
        if (SiteConfig.isMobile) { return; }
        this.transitionInTimestep += deltaTime / HexagonsTitle.transitionInTime;

        if (this.transitionInTimestep > 1) {
            this.transitionInTimestep = 1;
        } else {
            this.renderer.requestDraw();
        }
    }

    public draw(X: CanvasRenderingContext2D): void {
        const scrollFactor = -this.scrollDist / this.layers.length;

        X.fillStyle = this.gradient;
        X.fillRect(0, 0, this.width, this.height);

        if (!this.isVertical) {
            this.drawLogo(X);
        }

        const t = easeInOutQuart(this.transitionInTimestep);

        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            const scale = 2 * (i + 1) * (1 - t) + 1;
            X.save();
            if (t < 0.1) { X.globalAlpha = t * 10; }
            X.translate(this.width / 2, this.height / 2);
            X.scale(scale, scale);
            X.translate(-this.width / 2, -this.height / 2);
            X.translate(0, i * scrollFactor);
            layer.draw(X);
            X.restore();
        }

        if (this.isVertical) {
            this.drawLogo(X);
        }
    }

    public appendToParent(): void {
        this.parent.appendChild(this.elm);
    }

    private createLayers(): HexagonsLayer[] {
        const layers: HexagonsLayer[] = [];

        for (let i: number = 0; i < SiteConfig.hexagonsTitle.layers; i++) {
            layers.push(new HexagonsLayer(this));
        }

        return layers;
    }

    private createGradient(): CanvasGradient {
        const gradient: CanvasGradient = this.renderer.getContext().createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, "#c2ffe3");
        gradient.addColorStop(1, "#ffffff");
        return gradient;
    }

    private drawLogo(X: CanvasRenderingContext2D): void {
        this.logo.draw(
            X,
            this.width / 2,
            this.height / 2
        );
    }

    private resizeHandler(): void {
        this.renderer.resizeOrWatchForResize();
    }

    private setSize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.elm.style.width = width + "px";
        this.elm.style.height = height + "px";

        this.isVertical = height > width;
        this.gradient = this.createGradient();
    }

    private scrollHandler(): void {
        if (SiteConfig.isMobile) { return; }
        this.scrollDist = this.parent.scrollTop;
        this.renderer.drawOnScroll();
    }
}

WidgetMap.add(HexagonsTitle);

export default HexagonsTitle;