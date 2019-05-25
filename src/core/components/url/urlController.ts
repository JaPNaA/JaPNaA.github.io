import ViewMap from "../../view/viewMap";
import IApp from "../../types/app/iApp";
import AppState from "../../types/appState";
import parseAppStateURL from "../../utils/parseAppStateURL";

class URLController {
    public restored: boolean;
    public currentURL: string;

    private shouldRestore: boolean;
    private initalSearch: string;
    private initalURL: string;
    private initalHash: string;

    private stateEmpty: boolean;
    private siteTitle: string;

    constructor() {
        this.siteTitle = document.title;

        this.initalURL = location.href;
        this.currentURL = location.href;
        this.initalSearch = location.search;
        this.initalHash = location.hash;

        this.shouldRestore = false;
        this.stateEmpty = true;
        this.restored = false;

        this.setToOldURL();
    }

    public setTitle(title: string) {
        this.siteTitle = title;
    }

    public setState(viewName: string, viewStateData?: string): void {
        const { title, url } = this.getTitleAndURLFromViewState(viewName, viewStateData);

        history.replaceState(null, title, url);
        this.currentURL = url;
        document.title = title;
        this.stateEmpty = false;
    }

    public pushState(viewName: string, viewStateData?: string): void {
        if (this.stateEmpty) {
            return this.setState(viewName, viewStateData);
        }

        const { title, url } = this.getTitleAndURLFromViewState(viewName, viewStateData);

        history.pushState(null, title, url);
        this.currentURL = url;
        document.title = title;
    }

    public async restoreFromRedirect(app: IApp): Promise<void> {
        if (!this.shouldRestore) { return; }
        return this.restoreFromURL(app, this.initalURL);
    }

    public async restoreFromURL(app: IApp, url: string): Promise<void> {
        const urlParsed = parseAppStateURL(url);
        if (!urlParsed) { return; }

        urlParsed.directURL = url;
        await this.restore(app, urlParsed);

        if (!this.restored && app.view404) {
            app.views.openBehind(app.view404);
            this.restored = true;
        }
    }

    public restore(app: IApp, state: AppState): Promise<void> {
        return this.restoreView(app, state);
    }

    public clearState(): void {
        history.replaceState(
            null, this.siteTitle, "/"
        );
        this.currentURL = "/";
    }

    private async restoreView(app: IApp, state: AppState): Promise<void> {
        const viewClass = await ViewMap.get(state.viewName);
        if (viewClass) {
            app.views.openBehind(viewClass, state);
            this.restored = true;
        } else {
            this.restored = false;
        }
    }

    private getTitleAndURLFromViewState(viewName: string, viewStateData?: string): { url: string, title: string } {
        const viewNameEnc = encodeURIComponent(viewName.toLowerCase());
        const title = this.siteTitle + "." + viewNameEnc;

        let url = "/" + viewNameEnc;

        if (viewStateData) {
            const dataEnc = encodeURIComponent(viewStateData);
            url += "/" + dataEnc;
        }

        return { url, title };
    }

    private setToOldURL(): void {
        const urlparams = new URLSearchParams(this.initalSearch);
        const initalURL = urlparams.get("u");

        if (urlparams.get("fromredirect") === '1' && initalURL) {
            this.initalURL = initalURL;
            this.shouldRestore = true;
            history.replaceState(null, this.siteTitle, initalURL);
        } else if (this.initalHash) {
            this.shouldRestore = true;
            history.replaceState(null, this.siteTitle, "/" + this.initalHash);
        }
    }
}

export default URLController;