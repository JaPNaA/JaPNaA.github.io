import siteResources from "../../siteResources";

class ViewMaybeInlinedContent {
    public data?: string;
    public loaded: boolean;

    private absolutePath: string;

    constructor(path: string) {
        this.absolutePath = path;
        this.loaded = false;

        this.setup();
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

        this.data = this.unescapeForXML(preloadElm.innerHTML);
        this.loaded = true;
        this.removeElement(preloadElm);
    }

    private loadFromNetwork(): void {
        siteResources.loadText(this.absolutePath)
            .onLoad(resource => {
                this.data = resource.data;
                this.loaded = true;
            });
    }

    private removeElement(elm: HTMLElement): void {
        if (elm.parentElement) {
            elm.parentElement.removeChild(elm);
        }
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