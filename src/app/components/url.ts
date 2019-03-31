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
    private frozen: boolean;

    constructor(app: BaseApp, appEvents: AppEvents) {
        this.app = app;
        this.appEvents = appEvents;
        this.controller = new URLController();
        this.history = [];

        this.frozen = false;

        this.attachEventHandlers();
    }

    public restoreIfShould(): void {
        this.controller.restoreFromRedirect(this.app);
        this.restored = this.controller.restored;
    }

    public pushHistory(view: View): void {
        const viewState = view.getState();
        this.history.push({
            viewName: view.viewName,
            id: view.id,
            stateData: viewState
        });
        this.pushState(view.viewName, viewState);
    }

    public update(): void {
        const topView = this.app.views.firstFullTop();
        if (topView) {
            const viewState = topView.getState();
            const historyEntry = this.history.find((v) => v.id == topView.id);

            if (!historyEntry) { throw new Error("Cannot update state with unregistered view"); }
            this.setURLState(topView.viewName, viewState);
            historyEntry.stateData = viewState;
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
        // TODO: Temporary fix
        console.log("popstate", event);

        const newURL = location.href;

        this.frozen = true;

        this.app.views.closeAllViews();
        this.history = [];
        this.controller.restoreFromURL(this.app, newURL);

        this.frozen = false;
    }

    private setURLState(viewName: string, stateData?: string) {
        if (this.frozen) { return; }
        this.controller.setState(viewName, stateData);
    }

    private pushState(viewName: string, stateData?: string) {
        if (this.frozen) { return; }
        this.controller.pushState(viewName, stateData);
    }

    private clearState() {
        if (this.frozen) { return; }
        this.controller.clearState();
    }
}

export default AppURL;