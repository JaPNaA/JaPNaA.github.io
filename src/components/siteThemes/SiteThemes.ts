import siteResources from "../../core/siteResources";

class SiteThemes {
    private styleElm: HTMLStyleElement;
    private enabled: boolean;

    constructor() {
        this.styleElm = document.createElement("style");
        this.styleElm.type = "text/css";
        this.enabled = false;
    }

    public async enable(href: string): Promise<void> {
        this.styleElm.innerHTML = "";
        const innerHTML = await siteResources.loadTextPromise(href);
        this.styleElm.innerHTML = innerHTML

        if (!this.enabled) {
            document.head.appendChild(this.styleElm);
        }
        this.enabled = true;
    }

    public disable(): void {
        if (!this.enabled) { return; }
        document.head.removeChild(this.styleElm);
        this.enabled = false;
    }
}

export default SiteThemes;