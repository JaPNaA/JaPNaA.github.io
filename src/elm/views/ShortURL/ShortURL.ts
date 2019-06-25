import "../../../../styles/views/ShortUrl.less";

import View from "../../../core/view/View";
import ViewMap from "../../../core/view/ViewMap";
import IApp from "../../../core/types/app/IApp";
import parseShortUrl from "../../../components/url/parseShortUrl";
import AppState from "../../../core/types/AppState";
import isUrlAbsolute from "../../../utils/isUrlAbsolute";
import SiteConfig from "../../../SiteConfig";

class ShortUrlView extends View {
    public static viewName = "ShortUrl";
    public static viewMatcher = /^#/;
    public viewName = ShortUrlView.viewName;

    protected elm: HTMLDivElement;

    private hash: string;
    private newHref?: string;

    constructor(app: IApp, state: AppState) {
        super(app);
        console.log(state);
        if (state.directURL === undefined) { throw new Error("No hash provided"); }

        this.elm = document.createElement("div");
        this.hash = state.viewName;
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

    private async redirect(): Promise<void> {
        const shortUrl = await parseShortUrl(this.hash.slice(1));
        this.newHref = shortUrl;
    }

    private resolveNewHref(): string {
        const href = this.newHref as string;
        if (isUrlAbsolute(href)) {
            return href;
        } else {
            return SiteConfig.path.thingy + href;
        }
    }
}

ViewMap.add(ShortUrlView);

export default ShortUrlView;