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

        if (!this.restored && app.view404) {
            await app.views.switchAndInit(app.view404);
            this.restored = true;
        }
    }

    public async view(app: IApp, state: AppState): Promise<void> {
        try {
            let existingView =
                state.id !== undefined &&
                app.views.getById(state.id);

            if (existingView && existingView.viewName === state.viewName) {
                app.views.closeAllViewsExcept(existingView);
            } else {
                app.views.closeAllViews();
                await app.views.open(state.viewName, state);
            }

            this.restored = true;
        } catch (err) {
            console.warn(err);
            this.restored = false;
        }
    }
}

export default URLRestorer;