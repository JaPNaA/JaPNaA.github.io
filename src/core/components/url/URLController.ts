import URLRestorer from "./URLRestorer";
import IApp from "../../types/app/IApp";
import AppState from "../../types/AppState";
import siteConfig from "../../../SiteConfig";
import urlFromViewState from "../../../utils/urlFromViewState";

class URLController {
    public currentURL: string;
    public restore: URLRestorer;

    private initalSearch: string;
    private initalURL: string;
    private initalHash: string;
    private initalState: string;

    private stateEmpty: boolean;
    private siteTitle: string;

    constructor() {
        this.restore = new URLRestorer();

        this.siteTitle = document.title;
        this.currentURL = location.href;
        this.stateEmpty = true;

        this.initalSearch = location.search;
        this.initalHash = location.hash;
        this.initalURL = location.href;
        this.initalState = history.state;

        this.setToOldURL();
    }

    public restoreFromRedirect(app: IApp): Promise<void> {
        let state: AppState | undefined = undefined;
        try {
            state = JSON.parse(this.initalState);
        } catch (err) {
            console.warn("Failed to get state", err);
        }

        return this.restore.fromURL(app, this.initalURL, state);
    }

    public setTitle(title: string) {
        this.siteTitle = title;
    }

    public setState(viewName: string, state: AppState): void {
        const { title, url } = this.getTitleAndURLFromViewState(viewName, state.stateData);

        this.basedReplaceState(JSON.stringify(state), title, url);
        this.currentURL = url;
        document.title = title;
        this.stateEmpty = false;
    }

    public pushState(viewName: string, state: AppState): void {
        if (this.stateEmpty) {
            return this.setState(viewName, state);
        }

        const { title, url } = this.getTitleAndURLFromViewState(viewName, state.stateData);

        this.basedPushState(JSON.stringify(state), title, url);
        this.currentURL = url;
        document.title = title;
    }

    public clearState(): void {
        this.basedReplaceState(
            null, this.siteTitle, "/"
        );
        this.currentURL = "/";
    }

    private getTitleAndURLFromViewState(viewName: string, viewStateData?: string): { url: string, title: string } {
        const title = this.siteTitle + "." + viewName;
        return { title, url: urlFromViewState(viewName, viewStateData) };
    }

    private setToOldURL(): void {
        if (!siteConfig.isAtRoot) { return; }
        const urlparams = new URLSearchParams(this.initalSearch);
        const initalURL = urlparams.get("u");
        const state = urlparams.get("s");

        if (state) {
            this.initalState = state;
        }

        if (urlparams.get("fromredirect") === '1' && initalURL) {
            this.initalURL = initalURL;
            this.restore._canRestore = true;
            history.replaceState(state, this.siteTitle, initalURL);
        } else if (this.initalHash) {
            this.restore._canRestore = true;
            history.replaceState(state, this.siteTitle, "/" + this.initalHash);
        }
    }

    private basedReplaceState(state: any, title: string, url: string): void {
        if (siteConfig.isAtRoot) {
            history.replaceState(state, title, url);
        } else {
            history.replaceState(state, title, siteConfig.path.base + "#" + url);
        }
    }

    private basedPushState(state: any, title: string, url: string): void {
        if (siteConfig.isAtRoot) {
            history.pushState(state, title, url);
        } else {
            history.pushState(state, title, siteConfig.path.base + "#" + url);
        }
    }
}

export default URLController;