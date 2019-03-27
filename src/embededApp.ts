import BaseApp from "./baseApp";
import FakeURLMan from "./components/url/fakeUrlMan";
import EventHandlers from "./utils/events/eventHandlers";

class EmbededApp extends BaseApp {
    public url: FakeURLMan;
    protected resizeHandlers: EventHandlers;
    private parentElm: Element;

    constructor(parentElm: Element) {
        super();
        this.resizeHandlers = new EventHandlers();
        this.url = new FakeURLMan();
        this.parentElm = parentElm;
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
        this.resizeHandlers.dispatch();
    }
}

export default EmbededApp;