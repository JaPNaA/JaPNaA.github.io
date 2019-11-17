import URLRestorer from "./URLRestorer";
import IApp from "../../types/app/IApp";
import AppState from "../../types/AppState";
import urlFromState from "../../../utils/urlFromViewState";

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

    public setState(state: AppState): void {
        const { title, url } = this.getTitleAndURLFromState(state);

        this.basedReplaceState(JSON.stringify(state), title, url);
        this.currentURL = url;
        document.title = title;
        this.stateEmpty = false;
    }

    public pushState(state: AppState): void {
        if (this.stateEmpty) {
            return this.setState(state);
        }

        const { title, url } = this.getTitleAndURLFromState(state);

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

    private getTitleAndURLFromState(state: AppState): { url: string, title: string } {
        const pretitle = state.viewTitle ? state.viewTitle + " in " : "";
        const title = pretitle + this.siteTitle + (
            state.viewPath ?
                "." + state.viewPath.replace(/\//g, '.') :
                ""
        );
        return { title, url: urlFromState(state) };
    }

    private setToOldURL(): void {
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
        history.replaceState(state, title, url);
    }

    private basedPushState(state: any, title: string, url: string): void {
        history.pushState(state, title, url);
    }
}

export default URLController;