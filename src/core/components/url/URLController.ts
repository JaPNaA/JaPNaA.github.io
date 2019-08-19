import URLRestorer from "./URLRestorer";
import IApp from "../../types/app/IApp";
import AppState from "../../types/AppState";
import siteConfig from "../../../SiteConfig";


class URLController {
    public currentURL: string;
    public restore: URLRestorer;

    private initalSearch: string;
    private initalURL: string;
    private initalHash: string;

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

        this.setToOldURL();
    }

    public restoreFromRedirect(app: IApp): Promise<void> {
        return this.restore.fromURL(app, this.initalURL);
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
        if (!siteConfig.isAtRoot) { return; }
        const urlparams = new URLSearchParams(this.initalSearch);
        const initalURL = urlparams.get("u");

        if (urlparams.get("fromredirect") === '1' && initalURL) {
            this.initalURL = initalURL;
            this.restore._canRestore = true;
            history.replaceState(null, this.siteTitle, initalURL);
        } else if (this.initalHash) {
            this.restore._canRestore = true;
            history.replaceState(null, this.siteTitle, "/" + this.initalHash);
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