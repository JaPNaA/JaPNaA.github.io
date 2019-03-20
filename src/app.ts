import "../styles/index.less";

import SplashScreen from "./views/splashScreen";
import View from "./views/_view";
import ViewClass from "./types/ViewClass";
import Overview from "./views/overview";
import URLManager from "./components/url/urlMan";
import SiteResources from "./siteResources";

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

        const splashScreen: View = this.openView(SplashScreen);

        await this.loadResources();
        this.closeView(splashScreen);

        URLManager.restoreIfShould(this);

        if (!URLManager.restoredFromRedirect) {
            this.openView(Overview);
        }
    }

    public switchAndInitView(viewClass: ViewClass): View {
        const view: View = new viewClass(this);
        view.setup();
        this.switchView(view);
        return view;
    }

    public switchView(view: View): void {
        for (const activeView of this.activeViews) {
            this.closeView(activeView);
        }
        view.appendAtStartTo(this.mainElm);
        this.activeViews.push(view);
    }

    public openView(viewClass: ViewClass): View {
        const view: View = new viewClass(this);
        view.setup();
        view.appendAtStartTo(this.mainElm);
        this.activeViews.push(view);
        return view;
    }

    public closeView(view: View): void {
        const i: number = this.activeViews.indexOf(view);
        if (i < 0) { throw new Error("Attempt to remove view not in activeViews"); }
        this.activeViews.splice(i, 1);

        view.destory().then(() => view.removeFrom(this.mainElm));
    }

    private async loadResources(): Promise<void> {
        // TODO: remove simulated wait
        await SiteResources.nextDone();
    }
}

export default App;