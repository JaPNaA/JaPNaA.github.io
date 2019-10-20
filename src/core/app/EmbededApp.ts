import "../../../styles/embededApp.less";

import IApp from "../types/app/IApp";
import FakeAppURL from "./components/FakeURL";
import BaseApp from "./BaseApp";
import Router from "../components/router/Router";

class EmbededApp extends BaseApp {
    public url: FakeAppURL;
    public title: string = "embededApp";

    public parentApp: IApp;
    public indexRouter: Router;

    protected parentElm: Element;

    constructor(parentApp: IApp, parentElm: Element) {
        super(parentApp);

        this.parentApp = parentApp;
        this.parentElm = parentElm;
        this.indexRouter = parentApp.indexRouter;
        this.mainElm.classList.add("embededApp");
        this.url = new FakeAppURL();
    }

    public async setup(): Promise<void> {
        super.setup();
        this.addEventHandlers();
        this.parentElm.appendChild(this.mainElm);

        this.resizeNextFrame();
    }

    public async destory(): Promise<void> {
        this.parentApp.events.offResize(this.resizeHandler);
    }

    private addEventHandlers() {
        this.resizeHandler = this.resizeHandler.bind(this);
        this.parentApp.events.onResize(this.resizeHandler);

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
        this.focus();
    }
}

export default EmbededApp;