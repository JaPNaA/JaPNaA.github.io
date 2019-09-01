import parseAppStateURL from "../../utils/parseAppStateURL";
import IApp from "../../types/app/IApp";
import AppState from "../../types/AppState";

class URLRestorer {
    public restored: boolean;
    public _canRestore: boolean;

    constructor() {
        this.restored = false;
        this._canRestore = false;
    }

    public async fromURL(app: IApp, url: string, state?: AppState): Promise<void> {
        const urlParsed = parseAppStateURL(url);
        if (!urlParsed) { return; }

        urlParsed.directURL = url;
        await this.view(app, state || urlParsed);
    }

    public async view(app: IApp, state: AppState): Promise<void> {
        let existingView =
            state.id !== undefined &&
            app.views.getById(state.id);

        if (
            existingView &&
            existingView.viewName === state.viewName &&
            existingView.setState(state.stateData)
        ) {
            app.views.closeAllViewsExcept(existingView);
        } else {
            await app.views.switchAndInit(state.viewName, state);
        }

        this.restored = true;
    }
}

export default URLRestorer;