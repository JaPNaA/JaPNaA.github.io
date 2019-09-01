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

    private currView?: View;

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

        if (this.currView && this.currView !== view) {
            this.updateViewIfIsCurrent(this.currView);
        }

        this.history.push(state);
        this.pushState(view.viewName, state);

        this.currView = view;
    }

    public updateViewIfIsCurrent(view: View): void {
        if (view !== this.currView) { return; }
        this.updateView(view);
    }

    public update(): void {
        const topView = this.app.views.topFull();
        if (!topView) { return; }
        this.updateView(topView);
    }

    private updateView(view: View) {
        const historyEntry = this.history.findByID(view.id);
        const state = this.createAppState(view);

        if (!historyEntry) { throw new Error("Cannot update state with unregistered view"); }
        this.setURLState(view.viewName, state);
        historyEntry.stateData = state.stateData;
        historyEntry.privateData = state.privateData;
    }

    private attachEventHandlers(): void {
        this.topFulViewChangeHandler = this.topFulViewChangeHandler.bind(this);
        this.appEvents.onTopFullViewChange(this.topFulViewChangeHandler);

        this.popStateHandler = this.popStateHandler.bind(this);
        addEventListener("popstate", this.popStateHandler);
    }

    private topFulViewChangeHandler(): void {
        this.update();
    }

    private async popStateHandler(event: PopStateEvent): Promise<void> {
        const newURL = location.href;
        const parsedURL = parseAppStateURL(newURL);
        if (!parsedURL) { console.warn("URL has no state"); return; }
        const state = event.state && JSON.parse(event.state);

        this.frozen = true;
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
        console.log("setState", viewName, state);
        this.controller.setState(viewName, state);
    }

    private pushState(viewName: string, state: AppState) {
        if (this.frozen) { return; }
        console.log("pushState", viewName, state);
        this.controller.pushState(viewName, state);
    }

    private createAppState(view: View): AppState {
        return {
            viewName: view.viewName,
            stateData: view.getState(),
            directURL: this.controller.currentURL,
            id: view.id,
            privateData: view.getPrivateData()
        };
    }
}

export default AppURL;