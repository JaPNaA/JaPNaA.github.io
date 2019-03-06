import SiteConfig from "../../siteConfig";

class URLManager {
    private static search: string;
    private static stateEmpty: boolean;

    public static setup() {
        this.search = location.search;
        this.stateEmpty = true;
        this.setToOldURL();
    }

    public static setState(viewName: string, viewStateData?: string): void {
        const { title, url } = this.getTitleAndURLFromViewState(viewName, viewStateData);

        history.replaceState(null, title, url);
        document.title = title;
        this.stateEmpty = false;
    }

    public static pushState(viewName: string, viewStateData?: string): void {
        if (this.stateEmpty) {
            return this.setState(viewName, viewStateData);
        }

        const { title, url } = this.getTitleAndURLFromViewState(viewName, viewStateData);

        history.pushState(null, title, url);
        document.title = title;
    }

    private static getTitleAndURLFromViewState(viewName: string, viewStateData?: string): { url: string, title: string } {
        const viewNameEnc = encodeURIComponent(viewName.toLowerCase());
        const title = SiteConfig.title + "." + viewNameEnc;

        let url = viewNameEnc;

        if (viewStateData) {
            const dataEnc = encodeURIComponent(viewStateData);
            url += "/" + dataEnc;
        }

        return { url, title };
    }

    public static clearState(): void {
        history.replaceState(
            null, SiteConfig.title
        )
    }

    private static setToOldURL() {
        const urlparams = new URLSearchParams(this.search);
        const oldURL = urlparams.get("u");

        if (urlparams.get("fromredirect") === '1' && oldURL) {
            history.replaceState(null, SiteConfig.title, oldURL);
        }
    }
}

URLManager.setup();

export default URLManager;