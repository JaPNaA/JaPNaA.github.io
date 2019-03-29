import AppEvents from "./events";
import IAppURL from "../../types/app/iAppURL";
import URLController from "../../components/url/urlController";
import BaseApp from "../baseApp";
import View from "../../elm/views/view";
import AppState from "../../types/appState";

class AppURL implements IAppURL {
    public restored: boolean = false;

    private app: BaseApp;
    private appEvents: AppEvents;

    private controller: URLController;
    private history: AppState[];
    private isFake: boolean = false;

    constructor(app: BaseApp, appEvents: AppEvents) {
        this.app = app;
        this.appEvents = appEvents;
        this.controller = new URLController();
        this.history = [];

        this.attachEventHandlers();
    }

    public setFake() {
        this.isFake = true;
    }

    public restoreIfShould(): void {
        if (this.isFake) { return; }
        this.controller.restoreFromRedirect(this.app);
        this.restored = this.controller.restored;
    }

    public register(view: View): void {
        const viewState = view.getState();
        this.history.push({
            viewName: view.viewName,
            stateData: viewState
        });
        this.pushState(view.viewName, viewState);
    }

    public unregister(view: View): void {
        const lastEntry = this.history[this.history.length - 1];
        if (lastEntry && lastEntry.viewName === view.viewName) {
            history.back();
            this.history.pop();
        } else {
            console.warn("Failed to unregister a view.", lastEntry, view);
        }
    }

    public update(): void {
        if (this.isFake) { return; }
        const topView = this.app.views.firstFullTop();
        if (topView) {
            const viewState = topView.getState();
            this.setState(topView.viewName, viewState);
            this.history[this.history.length - 1].stateData = viewState;
        } else {
            this.clearState();
        }
    }

    private attachEventHandlers(): void {
        this.viewChangeHandler = this.viewChangeHandler.bind(this);
        this.appEvents.onViewChange(this.viewChangeHandler);

        this.popStateHandler = this.popStateHandler.bind(this);
        addEventListener("popstate", this.popStateHandler);
    }

    private viewChangeHandler(): void {
        this.update();
    }

    private popStateHandler(event: PopStateEvent): void {
        console.log("popstate", event);
        this.history = [];
        this.app.views.closeAllViews();
        this.controller.restoreFromURL(this.app, location.href);
    }

    private setState(viewName: string, stateData?: string) {
        if (this.isFake) { return; }
        this.controller.setState(viewName, stateData);
    }

    private pushState(viewName: string, stateData?: string) {
        if (this.isFake) { return; }
        this.controller.pushState(viewName, stateData);
    }

    private clearState() {
        if (this.isFake) { return; }
        this.controller.clearState();
    }
}

export default AppURL;