import "../../styles/views/splashScreen.less";

import View from "./view";
import wait from "../utils/wait";
import App from "../app";

class SplashScreen extends View {
    public viewName = "SplashScreen";
    protected elm: HTMLDivElement;

    constructor(app: App) {
        super(app);
        this.elm = document.createElement("div");
    }

    public setup() {
        super.setup();

        const child = document.createElement("div");
        child.innerText = "Loading...\n:)";
        child.classList.add("child");
        this.elm.appendChild(child);
    }

    public async destory(): Promise<void> {
        this.elm.classList.add("destory");

        await wait(1000);
    }
}

export default SplashScreen;