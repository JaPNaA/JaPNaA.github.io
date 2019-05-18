import View from "../view";
import ViewMap from "../viewMap";
import IApp from "../../../types/app/iApp";
import parseShortUrl from "../../../components/url/parseShortUrl";
import AppState from "../../../types/appState";

class ShortUrlView extends View {
    public static viewName = "#";
    public viewName = ShortUrlView.name;

    protected elm: HTMLDivElement;

    private hash: string;
    private newHref?: string;

    constructor(app: IApp, state: AppState) {
        super(app);
        if (state.stateData === undefined) { throw new Error("No hash provided"); }

        this.elm = document.createElement("div");
        this.hash = state.stateData;
    }

    public setup(): void {
        super.setup();
        this.elm.innerHTML = this.hash + "<br>";

        this.redirect()
            .then(() => this.elm.innerHTML += this.newHref)
            .catch(e => this.elm.innerHTML += e);
    }

    private async redirect(): Promise<void> {
        const shortUrl = await parseShortUrl(this.hash.slice(1));
        this.newHref = shortUrl;
    }
}

ViewMap.add(ShortUrlView);

export default ShortUrlView;