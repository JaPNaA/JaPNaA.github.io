import "../../../../styles/widgets/hexagonsTitle.less";

import HexagonsLayer from "./HexagonsLayer";
import siteConfig from "../../../SiteConfig";
import siteResources from "../../../core/siteResources";
import Widget from "../../../core/widget/Widget";
import WidgetMap from "../../../core/widget/WidgetMap";
import Logo from "./Logo";
import HexagonsTitleRenderer from "./HexagonsTitleRenderer";
import { easeInOutQuart } from "../../../utils/easingFunctions";
import IApp from "../../../core/types/app/IApp";

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

    private app: IApp;

    private renderer: HexagonsTitleRenderer;
    private logo: Logo;
    private layers: HexagonsLayer[];

    private scrollDist: number;
    private gradient: CanvasGradient;
    private registeredEventHandlers: boolean;

    private drawLogoOver: boolean;
    private loaded: boolean;

    private transitionInTimestep: number;

    constructor(app: IApp, parentElm: HTMLElement) {
        super();
        this.parent = parentElm;

        this.app = app;
        this.elm = document.createElement("div");

        this.width = app.width;
        this.height = app.height;
        this.overSizeHeight = 0;
        this.overSizeWidth = 0;
        this.drawLogoOver = false;
        this.loaded = false;

        this.renderer = new HexagonsTitleRenderer(app, this);
        this.layers = this.createLayers();
        this.gradient = this.createGradient();
        this.logo = new Logo(this.width, this.height);

        this.scrollDist = 0;
        this.transitionInTimestep = 0;

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
        this.renderer.onResize(this.resizeHandler);

        this.settingsChangeHandler = this.settingsChangeHandler.bind(this);
        siteConfig.onSettingsChanged(this.settingsChangeHandler);

        // POSSIBLE BUG: destory before nextDone
        siteResources.nextDone().then(() => {
            this.loaded = true;
            this.renderer.clearTimer();
            this.renderer.requestDraw();
        });

        this.registeredEventHandlers = true;
    }

    public destory(): void {
        super.destory();
        this.renderer.destory();
        if (this.registeredEventHandlers) {
            this.parent.removeEventListener("scroll", this.scrollHandler);
            this.renderer.offResize(this.resizeHandler);
            siteConfig.offSettingsChanged(this.settingsChangeHandler);
        }
    }

    public setOverSize(overSizeWidth: number, overSizeHeight: number): void {
        this.overSizeHeight = overSizeHeight;
        this.overSizeWidth = overSizeWidth;
        this.resizeHandler();
    }

    public tick(deltaTime: number): void {
        if (siteConfig.isMobile || !this.loaded) { return; }
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

        if (!this.drawLogoOver) {
            this.drawLogo(X);
        }

        const t = easeInOutQuart(this.transitionInTimestep);

        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            const scale = siteConfig.hexagonsTitle.zoomDistance * (i + 1) * (1 - t) + 1;
            X.save();
            if (t < siteConfig.hexagonsTitle.fadeInSpeed) {
                X.globalAlpha = t * 1 / siteConfig.hexagonsTitle.fadeInSpeed;
            }
            X.translate(this.width / 2, this.height / 2);
            X.scale(scale, scale);
            X.translate(-this.width / 2, -this.height / 2);
            X.translate(0, i * scrollFactor);
            layer.draw(X);
            X.restore();
        }

        if (this.drawLogoOver) {
            this.drawLogo(X);
        }
    }

    public preventTransitionIn(): void {
        this.transitionInTimestep = 1;
    }

    public appendToParent(): void {
        this.parent.appendChild(this.elm);
    }

    private createLayers(): HexagonsLayer[] {
        const layers: HexagonsLayer[] = [];

        for (let i: number = 0; i < siteConfig.hexagonsTitle.layers; i++) {
            layers.push(new HexagonsLayer(this, i));
        }

        return layers;
    }

    private createGradient(): CanvasGradient {
        // BUG: createGradient is called *after* drawing when resizing
        const gradient: CanvasGradient = this.renderer.getContext().createLinearGradient(0, 0, 0, this.height);
        if (siteConfig.settings.darkMode) {
            gradient.addColorStop(0, "#202020");
            gradient.addColorStop(1, "#202020");
        } else {
            gradient.addColorStop(0, "#c2ffe3");
            gradient.addColorStop(1, "#ffffff");
        }
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
        this.setSize(this.app.width, this.app.height);
        this.renderer.updateSize();
    }

    private setSize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.elm.style.width = width + "px";
        this.elm.style.height = height + "px";

        this.drawLogoOver = height > width || height < 480;
        this.gradient = this.createGradient();
        this.logo.resize(width, height);
    }

    private settingsChangeHandler(): void {
        this.gradient = this.createGradient();
        this.renderer.requestDraw();
    }

    private scrollHandler(): void {
        if (siteConfig.isMobile) { return; }
        this.scrollDist = this.parent.scrollTop;
        this.renderer.drawOnScroll();
    }
}

WidgetMap.add(HexagonsTitle);

export default HexagonsTitle;