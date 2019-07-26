import parseAppStateURL from "../../utils/parseAppStateURL";
import IApp from "../../types/app/IApp";
import AppState from "../../types/AppState";
import ViewMap from "../../view/ViewMap";

class URLRestorer {
    public restored: boolean;
    public _canRestore: boolean;

    constructor() {
        this.restored = false;
        this._canRestore = false;
    }

    public async fromURL(app: IApp, url: string): Promise<void> {
        const urlParsed = parseAppStateURL(url);
        if (!urlParsed) { return; }

        urlParsed.directURL = url;
        await this.view(app, urlParsed);

        if (!this.restored && app.view404) {
            await app.views.open(app.view404);
            this.restored = true;
        }
    }

    public async view(app: IApp, state: AppState): Promise<void> {
        try {
            const viewClass = await ViewMap.get(state.viewName);
            await app.views.open(viewClass, state);
            this.restored = true;
        } catch (err) {
            console.warn(err);
            this.restored = false;
        }
    }
}

export default URLRestorer;