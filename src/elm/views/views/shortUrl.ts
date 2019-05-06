import View from "../view";
import ViewMap from "../viewMap";
import IApp from "../../../types/app/iApp";
import SiteConfig from "../../../siteConfig";
import SiteResources from "../../../siteResources";

class ShortUrlView extends View {
    public static viewName = "#";
    public viewName = ShortUrlView.name;

    protected elm: HTMLDivElement;

    private hash: string;
    private newHref?: string;

    constructor(app: IApp, hash?: string) {
        super(app);
        if (!hash) { throw new Error("No hash provided"); }

        this.elm = document.createElement("div");
        this.hash = hash;
    }

    public setup(): void {
        super.setup();
        this.elm.innerHTML = this.hash + "<br>";

        this.redirect()
            .then(() => this.elm.innerHTML += this.newHref)
            .catch(e => this.elm.innerHTML += e);
    }

    private async redirect(): Promise<void> {
        const firstChar = this.hash[1]; // not hash[0] because the first char is always '#'

        switch (firstChar) {
            case '#':
                await this.redirectToProjectByIndex();
                break;
            case '_':
                await this.redirectToProjectByYearAndName();
                break;
            default:
                await this.redirectByMap();
                break;
        }
    }

    private redirectToProjectByIndex(): void {
        // TODO: this will take more work using current code
        throw new Error("not implemented");
    }

    private redirectToProjectByYearAndName(): void {
        const hashContent = this.hash.slice(2); // trim out "#_"

        const year = hashContent.match(/^\d+/);
        if (!year) { throw new Error("No year specified"); }
        const yearInt = parseInt(year[0]) || 0;
        const path = hashContent.slice(year.length);

        if (isNaN(yearInt)) {
            throw new Error("Invalid year");
        }

        this.newHref = SiteConfig.path.repo.thingy_ + (yearInt + 2016) + "/" + path;
    }

    private async redirectByMap(): Promise<void> {
        const map = await this.getMap();
        const key = this.hash.slice(1); // trim out "#"
        const url = map.get(key);
        if (!url) {
            throw new Error("Invalid shortUrl");
        } else {
            this.newHref = url;
        }
    }

    private async getMap(): Promise<Map<string, string>> {
        return this.parseMap(await this.loadMap());
    }

    private async loadMap(): Promise<string> {
        return new Promise<string>(function (res, rej) {
            SiteResources.loadText(SiteConfig.path.redirectMap)
                .onLoad(e => {
                    if (e.text) {
                        res(e.text);
                    } else {
                        rej();
                    }
                })
                .onError(e => rej(e));
        });
    }

    private parseMap(text: string): Map<string, string> {
        const map = new Map<string, string>();
        const lines = text.split("\n");

        for (const line of lines) {
            const commaIndex = line.indexOf(",");
            const key = line.slice(0, commaIndex).trim();
            const value = line.slice(commaIndex + 1).trim();
            map.set(key, value);
        }

        return map;
    }
}

ViewMap.add(ShortUrlView);

export default ShortUrlView;