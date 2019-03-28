import BaseApp from "./baseApp";

class EmbededApp extends BaseApp {
    private parentElm: Element;

    constructor(parentElm: Element) {
        super();
        this.parentElm = parentElm;
        this.url.setFake();
    }

    public async setup(): Promise<void> {
        super.setup();
        this.addEventHandlers();
        this.parentElm.appendChild(this.mainElm);

        this.resizeNextFrame();
    }

    private addEventHandlers() {
        this.resizeHandler = this.resizeHandler.bind(this);
        addEventListener("resize", this.resizeHandler);
    }

    private resizeNextFrame() {
        requestAnimationFrame(() => this.resizeHandler());
    }

    private resizeHandler() {
        this.width = this.mainElm.clientWidth;
        this.height = this.mainElm.clientHeight;
        this.events.dispatchResize();
    }
}

export default EmbededApp;