import "../styles/index.less";

import SplashScreen from "./views/splashScreen";
import View from "./views/view";
import ViewClass from "./types/ViewClass";
import Overview from "./views/overview";
import ProjectDetailedView from "./views/projectDetailed";

class App {
    /** Main element app lives in */
    private mainElm: HTMLDivElement;
    /** All active scenes in app */
    private activeViews: View[];

    constructor() {
        this.mainElm = document.createElement("div");
        this.mainElm.classList.add("main");

        this.activeViews = [];
    }

    public async setup(): Promise<void> {
        document.body.appendChild(this.mainElm);

        const splashScreen = this.openView(SplashScreen);

        await this.loadResources();
        this.closeView(splashScreen);

        this.openView(Overview);

        // test
        // ----------------------------------------------------------------------------------------
        const proj = await fetch("./content/2018.json").then(e => e.json());
        const projectScene = new ProjectDetailedView(proj.data[0]);
        projectScene.setup();
        this.switchView(projectScene);
    }

    private async loadResources(): Promise<void> {
        // TODO: remove simulated wait
        await new Promise(function (res) {
            setTimeout(function () {
                res();
            }, 100);
        });
    }

    private switchAndInitView(viewClass: ViewClass): View {
        const view = new viewClass();
        view.setup();
        this.switchView(view);
        return view;
    }

    private switchView(view: View) {
        for (const activeView of this.activeViews) {
            this.closeView(activeView);
        }
        view.appendTo(this.mainElm);
    }

    private openView(viewClass: ViewClass): View {
        const view = new viewClass();
        view.setup();
        view.appendTo(this.mainElm);
        this.activeViews.push(view);
        return view;
    }

    private closeView(view: View): void {
        const i = this.activeViews.indexOf(view);
        if (i < 0) { throw new Error("Attempt to remove view not in activeViews"); }
        this.activeViews.splice(i, 1);

        view.destory().then(() => view.removeFrom(this.mainElm));
    }
}

export default App;