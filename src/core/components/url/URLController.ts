import URLRestorer from "./URLRestorer";
import IApp from "../../types/app/IApp";


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


    public clearState(): void {
        history.replaceState(
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
}

export default URLController;