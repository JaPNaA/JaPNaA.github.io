import siteResources from "../../siteResources";
import EventHandlers from "../../utils/events/EventHandlers";
import Handler from "../../utils/events/Handler";

class ViewMaybeInlinedContent {
    public data?: string;
    public loaded: boolean;

    private absolutePath: string;

    private loadHandlers: EventHandlers<string>;

    constructor(path: string) {
        this.absolutePath = path;
        this.loaded = false;

        this.loadHandlers = new EventHandlers();

        this.setup();
    }

    public onLoadPromise(): Promise<string> {
        if (this.loaded) { return Promise.resolve(this.data!); }
        return new Promise(res => this.loadHandlers.add(data => res(data)));
    }

    public onLoad(handler: Handler<string>): void {
        if (this.loaded) { handler(this.data!); }
        this.loadHandlers.add(handler);
    }

    public offLoad(handler: Handler<string>): void {
        this.loadHandlers.remove(handler);
    }

    private setup() {
        this.loadPreloadInDocument();
        if (this.loaded) { return; }

        this.loadFromNetwork();
    }

    private loadPreloadInDocument(): void {
        const id = "viewMaybeInlinedContent:" + btoa(this.absolutePath);
        const preloadElm = document.getElementById(id);

        if (!preloadElm) { return; }

        this.dispatchLoaded(this.unescapeForXML(preloadElm.innerHTML));
    }

    private loadFromNetwork(): void {
        siteResources.loadText(this.absolutePath)
            .onLoad(resource => {
                this.dispatchLoaded(resource.data);
            });
    }

    private dispatchLoaded(data: string): void {
        this.data = data;
        this.loaded = true;
        this.loadHandlers.dispatch(data);
    }

    private unescapeForXML(str: string): string {
        return (str.replace(/&amp;/g, "&")
            .replace(/&apos;/g, "'")
            .replace(/&quot;/g, "\"")
            .replace(/&gt;/g, ">")
            .replace(/&lt;/g, "<")
        );
    }
}

export default ViewMaybeInlinedContent;