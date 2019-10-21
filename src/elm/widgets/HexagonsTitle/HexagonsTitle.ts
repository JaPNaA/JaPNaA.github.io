import "./hexagonsTitle.less";

import siteConfig from "../../../SiteConfig";
import Widget from "../../../core/widget/Widget";
import HexagonsTitleRenderer from "./HexagonsTitleRenderer";
import IApp from "../../../core/types/app/IApp";

class HexagonsTitle extends Widget {
    public static cssName = "hexagonsTitle";
    public cssName = HexagonsTitle.cssName;

    public width: number;
    public height: number;
    public overSizeWidth: number;
    public overSizeHeight: number;

    protected elm: HTMLDivElement;
    protected parent: HTMLElement;

    private app: IApp;

    private renderer: HexagonsTitleRenderer;
    private registeredEventHandlers: boolean;


    constructor(app: IApp, parentElm: HTMLElement) {
        super();
        this.parent = parentElm;

        this.app = app;
        this.elm = document.createElement("div");

        this.width = app.width;
        this.height = app.height;
        this.overSizeHeight = 0;
        this.overSizeWidth = 0;

        this.renderer = new HexagonsTitleRenderer(app, this);

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

    public preventTransitionIn(): void {
        this.renderer.noTransitionIn();
    }

    public appendToParent(): void {
        this.parent.appendChild(this.elm);
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
    }

    private settingsChangeHandler(): void {
        this.renderer.requestDraw();
    }

    private scrollHandler(): void {
        if (siteConfig.isMobile) { return; }
        this.renderer.scrolled(this.parent.scrollTop);
    }
}

export default HexagonsTitle;