import "../../../styles/embededApp.less";

import IApp from "../types/app/iApp";
import FakeAppURL from "./components/fakeUrl";
import BaseApp from "./baseApp";

class EmbededApp extends BaseApp {
    public url: FakeAppURL;
    public title: string = "embededApp";

    private parentElm: Element;

    constructor(parentApp: IApp, parentElm: Element) {
        super(parentApp);
        this.parentElm = parentElm;
        this.url = new FakeAppURL();
        this.mainElm.tabIndex = -1; // this makes the app element focusable
    }

    public async setup(): Promise<void> {
        super.setup();
        this.addEventHandlers();
        this.parentElm.appendChild(this.mainElm);

        this.resizeNextFrame();
    }

    public async destory(): Promise<void> {
        removeEventListener("resize", this.resizeHandler);
    }

    private addEventHandlers() {
        this.resizeHandler = this.resizeHandler.bind(this);
        addEventListener("resize", this.resizeHandler);

        this.mainElm.addEventListener("keydown", this.keydownHandler.bind(this));
        this.mainElm.addEventListener("mouseover", this.mouseoverHandler.bind(this));
    }

    private resizeNextFrame() {
        requestAnimationFrame(() => this.resizeHandler());
    }

    private resizeHandler() {
        this.width = this.mainElm.clientWidth;
        this.height = this.mainElm.clientHeight;
        this.events.dispatchResize();
    }

    private keydownHandler(event: KeyboardEvent): void {
        event.stopPropagation();
        this.events.dispatchKeydown(event);
    }

    private mouseoverHandler(): void {
        this.mainElm.focus({
            preventScroll: true
        });
    }
}

export default EmbededApp;