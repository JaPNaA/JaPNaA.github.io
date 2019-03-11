import View from "./_view";
import wait from "../utils/wait";
import App from "../app";
import ViewMap from "./_list";

class SplashScreen extends View {
    public static viewName = "SplashScreen";
    public viewName = SplashScreen.viewName;
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

ViewMap.add(SplashScreen);

export default SplashScreen;