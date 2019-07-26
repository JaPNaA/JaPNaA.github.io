import "../../../../styles/views/SplashScreen.less";

import View from "../../../core/view/View";
import wait from "../../../utils/wait";
import ViewMap from "../../../core/view/ViewMap";
import IApp from "../../../core/types/app/IApp";
import AppState from "../../../core/types/AppState";

class SplashScreen extends View {
    public static viewName = "SplashScreen";
    public viewName = SplashScreen.viewName;
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

ViewMap.add(SplashScreen);

export default SplashScreen;