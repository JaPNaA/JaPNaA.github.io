import BaseApp from "./baseApp";
import FakeAppURL from "./components/fakeUrl";
import IApp from "../types/app/iApp";

class EmbededApp extends BaseApp {
    private parentElm: Element;
    public url: FakeAppURL;

    constructor(parentApp: IApp, parentElm: Element) {
        super(parentApp);
        this.parentElm = parentElm;
        this.url = new FakeAppURL();
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