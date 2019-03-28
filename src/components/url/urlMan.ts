import SiteConfig from "../../siteConfig";
import ViewMap from "../../elm/views/viewMap";

import url from "url";
import App from "../../app/app";
import View404 from "../../elm/views/views/404";
import IURLMan from "./iUrlMan";

class URLManager implements IURLMan {
    public restoredFromRedirect: boolean;

    private fromRedirect: boolean;
    private initalSearch: string;
    private initalURL: string;

    private stateEmpty: boolean;

    constructor() {
        this.initalURL = location.href;
        this.initalSearch = location.search;

        this.fromRedirect = false;
        this.stateEmpty = true;
        this.restoredFromRedirect = false;

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

    public restoreIfShould(app: App) {
        if (!this.fromRedirect) { return; }

        const urlParsed = this.parseInitalURL();
        if (!urlParsed) { return; }

        const viewClass = ViewMap.get(urlParsed.viewName);
        if (viewClass) {
            const view = new viewClass(app, urlParsed.viewStateData);
            view.setup();
            app.views.addBehind(view);
        } else {
            app.views.openBehind(View404);
        }

        this.restoredFromRedirect = true;
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

    private parseInitalURL(): { viewName: string, viewStateData?: string } | undefined {
        const cleanURL = url.parse(this.initalURL);
        if (!cleanURL.path) return;
        const cleanPath = cleanURL.path.slice(1);

        const divisorIndex = cleanPath.indexOf('/');
        if (divisorIndex < 0) {
            return { viewName: cleanPath };
        } else {
            const viewName = cleanPath.slice(0, divisorIndex);
            const viewStateData = decodeURIComponent(cleanPath.slice(divisorIndex + 1));

            return { viewName, viewStateData };
        }
    }
}

export default URLManager;