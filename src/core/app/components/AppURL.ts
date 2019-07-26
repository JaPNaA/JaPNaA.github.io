import AppEvents from "./AppEvents";
import URLController from "../../components/url/URLController";
import IAppURL from "../../types/app/IAppURL";
import View from "../../view/View";
import BaseApp from "../BaseApp";
import AppStateHistory from "../../components/history/AppStateHistory";
import parseAppStateURL from "../../utils/parseAppStateURL";
import AppState from "../../types/AppState";

class AppURL implements IAppURL {
    public restored: boolean = false;

    private app: BaseApp;
    private appEvents: AppEvents;

    private controller: URLController;
    private history: AppStateHistory; //* This can be removed, but it could be useful in the future?
    private frozen: boolean;

    constructor(app: BaseApp, appEvents: AppEvents) {
        this.app = app;
        this.appEvents = appEvents;
        this.controller = new URLController();
        this.history = new AppStateHistory();

        this.frozen = false;

        this.attachEventHandlers();
    }

    public setTitle(title: string) {
        this.controller.setTitle(title);
    }

    public async restoreIfShould(): Promise<void> {
        await this.controller.restoreFromRedirect(this.app);
        this.restored = this.controller.restore.restored;
    }

    public pushHistory(view: View): void {
        const state = this.createAppState(view);
        this.history.push(state);
        this.pushState(view.viewName, state);
    }

    public update(): void {
        const topView = this.app.views.firstFullTop();
        if (!topView) { return; }
        const viewState = topView.getState();
        const historyEntry = this.history.findByID(topView.id);

        if (!historyEntry) { throw new Error("Cannot update state with unregistered view"); }
        this.setURLState(topView.viewName, this.createAppState(topView));
        historyEntry.stateData = viewState;
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

    private async popStateHandler(event: PopStateEvent): Promise<void> {
        const newURL = location.href;
        const parsedURL = parseAppStateURL(newURL);
        if (!parsedURL) { console.warn("URL has no state"); return; }
        const state = event.state && JSON.parse(event.state);

        console.log(state);

        this.frozen = true;
        this.app.views.closeAllViews();
        this.controller.currentURL = newURL;

        if (state) {
            await this.controller.restore.view(this.app, state);
        } else {
            await this.controller.restore.fromURL(this.app, newURL);
        }

        this.frozen = false;
    }

    private setURLState(viewName: string, state: AppState) {
        if (this.frozen) { return; }
        this.controller.setState(viewName, state);
    }

    private pushState(viewName: string, state: AppState) {
        if (this.frozen) { return; }
        this.controller.pushState(viewName, state);
    }

    private createAppState(view: View): AppState {
        return {
            viewName: view.viewName,
            stateData: view.getState(),
            directURL: this.controller.currentURL,
            id: view.id,
            privateData: view.privateData
        };
    }
}

export default AppURL;