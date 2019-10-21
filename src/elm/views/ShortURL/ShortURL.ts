import "./ShortUrl.less";

import View from "../../../core/view/View";
import IApp from "../../../core/types/app/IApp";
import parseShortUrl from "../../../components/url/parseShortUrl";
import AppState from "../../../core/types/AppState";
import siteConfig from "../../../SiteConfig";
import resolveUrl from "../../../utils/resolveUrl";

class ShortUrlView extends View {
    public static viewName = "ShortUrl";
    public static viewMatcher = /^#/;
    public viewName = ShortUrlView.viewName;

    protected elm: HTMLDivElement;

    private hash: string;
    private newHref?: string;

    constructor(app: IApp, state: AppState) {
        super(app, state);

        if (state.directURL === undefined) { throw new Error("No hash provided"); }

        this.elm = document.createElement("div");
        this.hash = state.viewPath;
    }

    public setup(): void {
        super.setup();

        let redirectingWith = "Redirecting with hash <code>" + this.hash + "</code>";
        this.elm.innerHTML = redirectingWith + "...";

        this.redirect()
            .then(() => {
                this.elm.innerHTML = redirectingWith +
                    " to <a href=\"" + this.newHref + "\">" +
                    this.newHref + "</a>...";
                location.replace(this.resolveNewHref());
            })
            .catch(e => {
                this.elm.innerHTML = "Could not redirect from <code>" +
                    this.hash + "</code>,<br>" + e;
            });
    }

    public async destory(): Promise<void> {
        await super.destory();
    }

    private async redirect(): Promise<void> {
        const shortUrl = await parseShortUrl(this.hash.slice(1));
        this.newHref = shortUrl;
    }

    private resolveNewHref(): string {
        return resolveUrl(this.newHref!, siteConfig.path.thingy);
    }
}

export default ShortUrlView;