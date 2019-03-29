import SiteConfig from "../../siteConfig";
import ViewMap from "../../elm/views/viewMap";

import url from "url";
import View404 from "../../elm/views/views/404";
import IApp from "../../types/app/iApp";
import AppState from "../../types/appState";

class URLController {
    public restored: boolean;

    private fromRedirect: boolean;
    private initalSearch: string;
    private initalURL: string;

    private stateEmpty: boolean;

    constructor() {
        this.initalURL = location.href;
        this.initalSearch = location.search;

        this.fromRedirect = false;
        this.stateEmpty = true;
        this.restored = false;

        this.setToOldURL();
    }

    public setState(viewName: string, viewStateData?: string): void {
        const { title, url } = this.getTitleAndURLFromViewState(viewName, viewStateData);

        history.replaceState(null, title, url);
        document.title = title;
        this.stateEmpty = false;
    }

    public pushState(viewName: string, viewStateData?: string): void {
        if (this.stateEmpty) {
            return this.setState(viewName, viewStateData);
        }

        const { title, url } = this.getTitleAndURLFromViewState(viewName, viewStateData);

        history.pushState(null, title, url);
        document.title = title;
    }

    public restoreFromRedirect(app: IApp): void {
        if (!this.fromRedirect) { return; }
        this.restoreFromURL(app, this.initalURL);
    }

    public restoreFromURL(app: IApp, url: string): void {
        const urlParsed = this.parseURL(url);
        if (!urlParsed) { return; }

        this.restore(app, urlParsed);

        if (!this.restored) {
            app.views.openBehind(View404);
        }

        this.restored = true;
    }

    public restore(app: IApp, state: AppState) {
        const viewClass = ViewMap.get(state.viewName);
        if (viewClass) {
            const view = new viewClass(app, state.stateData);
            view.setup();
            app.views.addBehind(view);
            this.restored = true;
        } else {
            this.restored = false;
        }
    }

    private getTitleAndURLFromViewState(viewName: string, viewStateData?: string): { url: string, title: string } {
        const viewNameEnc = encodeURIComponent(viewName.toLowerCase());
        const title = SiteConfig.title + "." + viewNameEnc;

        let url = "/" + viewNameEnc;

        if (viewStateData) {
            const dataEnc = encodeURIComponent(viewStateData);
            url += "/" + dataEnc;
        }

        return { url, title };
    }

    public clearState(): void {
        history.replaceState(
            null, SiteConfig.title
        )
    }

    private setToOldURL() {
        const urlparams = new URLSearchParams(this.initalSearch);
        const initalURL = urlparams.get("u");

        if (urlparams.get("fromredirect") === '1' && initalURL) {
            this.initalURL = initalURL;
            this.fromRedirect = true;
            history.replaceState(null, SiteConfig.title, initalURL);
        }
    }

    private parseURL(href: string): AppState | undefined {
        const cleanURL = url.parse(href);
        if (!cleanURL.path) return;
        const cleanPath = cleanURL.path.slice(1);

        const divisorIndex = cleanPath.indexOf('/');
        if (divisorIndex < 0) {
            return { viewName: cleanPath };
        } else {
            const viewName = cleanPath.slice(0, divisorIndex);
            const stateData = decodeURIComponent(cleanPath.slice(divisorIndex + 1));

            return { viewName, stateData };
        }
    }
}

export default URLController;