import View from "../view";
import wait from "../../../utils/wait";
import ViewMap from "../viewMap";
import IApp from "../../../types/app";

class SplashScreen extends View {
    public static viewName = "SplashScreen";
    public viewName = SplashScreen.viewName;
    protected elm: HTMLDivElement;

    constructor(app: IApp) {
        super(app);
        this.elm = document.createElement("div");
    }

    public setup(): void {
        super.setup();

        const child: HTMLDivElement = document.createElement("div");
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