import AppEvents from "./events";
import IAppURL from "../../types/app/iAppURL";
import URLController from "../../components/url/urlController";
import BaseApp from "../baseApp";
import View from "../../elm/views/view";
import AppState from "../../types/appState";

class AppURL implements IAppURL {
    public restoredFromRedirect: boolean = false;

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

        this.attachViewChangeHandler();
    }

    public setFake() {
        this.isFake = true;
    }

    public restoreIfShould(): void {
        if (this.isFake) { return; }
        this.controller.restoreIfShould(this.app);
        this.restoredFromRedirect = this.controller.restoredFromRedirect;
    }

    private attachViewChangeHandler(): void {
        this.viewChangeHandler = this.viewChangeHandler.bind(this);
        this.appEvents.onViewChange(this.viewChangeHandler);
    }

    private viewChangeHandler(): void {
        this.update();
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