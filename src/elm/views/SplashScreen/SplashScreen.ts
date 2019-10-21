import "./SplashScreen.less";

import View from "../../../core/view/View";
import wait from "../../../utils/wait";
import IApp from "../../../core/types/app/IApp";
import AppState from "../../../core/types/AppState";

class SplashScreen extends View {
    public static cssName = "SplashScreen";
    public cssName = SplashScreen.cssName;
    protected elm: HTMLDivElement;

    public showMenuButton: boolean = false;

    constructor(app: IApp, state: AppState) {
        super(app, state);
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
        super.destory();
        await wait(1000);
    }
}

export default SplashScreen;