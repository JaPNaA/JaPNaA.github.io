import BaseApp from "./baseApp";
import FakeURLMan from "./components/url/fakeUrlMan";

class EmbededApp extends BaseApp {
    public url: FakeURLMan;
    private parentElm: Element;

    constructor(parentElm: Element) {
        super();
        this.url = new FakeURLMan();
        this.parentElm = parentElm;
    }

    public async setup(): Promise<void> {
        super.setup();
        this.parentElm.appendChild(this.mainElm);
    }
}

export default EmbededApp;