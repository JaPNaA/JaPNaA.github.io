import "../styles/index.less";

import SplashScreen from "./elm/views/views/splashScreen";
import View from "./elm/views/view";
import ViewClass from "./types/ViewClass";
import Overview from "./elm/views/views/overview";
import URLManager from "./components/url/urlMan";
import SiteResources from "./siteResources";
import GlobalWidget from "./elm/widgets/global/global";
import EventHandlers from "./utils/events/eventHandlers";
import Handler from "./utils/events/handler";

class App {
    /** Main element app lives in */
    private mainElm: HTMLDivElement;
    /** All active scenes in app */
    private activeViews: View[];
    /** The global widget */
    private globalWidget: GlobalWidget;

    private viewChangeHandlers: EventHandlers;

    constructor() {
        this.mainElm = document.createElement("div");
        this.mainElm.classList.add("main");
        this.globalWidget = new GlobalWidget(this);

        this.activeViews = [];
        this.viewChangeHandlers = new EventHandlers();
    }

    public async setup(): Promise<void> {
        this.globalWidget.setup();
        this.globalWidget.appendTo(this.mainElm);
        document.body.appendChild(this.mainElm);

        const splashScreen: View = this.openView(SplashScreen);

        URLManager.restoreIfShould(this);
        if (!URLManager.restoredFromRedirect) {
            this.openView(Overview);
        }

        await SiteResources.nextDone();
        this.closeView(splashScreen);
    }

    public getTopView(): View | undefined {
        return this.activeViews[this.activeViews.length - 1];
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
        this.addView(view);
    }

    public openView(viewClass: ViewClass): View {
        const view: View = new viewClass(this);
        view.setup();
        this.addView(view);
        return view;
    }

    public openViewBehind(viewClass: ViewClass): View {
        const view: View = new viewClass(this);
        view.setup();
        this.addViewBehind(view);
        return view;
    }

    public addView(view: View): void {
        view.appendAtStartTo(this.mainElm);
        console.log("add");
        this.activeViews.push(view);
        this.dispatchViewChange();
    }

    public addViewBehind(view: View): void {
        view.appendTo(this.mainElm);
        console.log("addbehind");
        this.activeViews.unshift(view);
        this.dispatchViewChange();
    }

    public closeView(view: View): void {
        const i: number = this.activeViews.indexOf(view);
        if (i < 0) { throw new Error("Attempt to remove view not in activeViews"); }
        this.activeViews.splice(i, 1);

        view.destory().then(() => view.removeFrom(this.mainElm));
        this.dispatchViewChange();
    }

    public onViewChange(handler: Handler) {
        this.viewChangeHandlers.add(handler);
    }

    public offViewChange(handler: Handler) {
        this.viewChangeHandlers.remove(handler);
    }

    private dispatchViewChange() {
        this.viewChangeHandlers.dispatch();
    }
}

export default App;