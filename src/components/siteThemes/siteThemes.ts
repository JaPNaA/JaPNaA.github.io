class SiteThemes {
    private linkElm: HTMLLinkElement;
    private enabled: boolean;

    constructor() {
        this.linkElm = document.createElement("link");
        this.linkElm.rel = "stylesheet";
        this.enabled = false;
    }

    public enable(href: string): void {
        this.linkElm.href = href;

        if (!this.enabled) {
            document.head.appendChild(this.linkElm);
        }
        this.enabled = true;
    }

    public disable(): void {
        if (!this.enabled) { return; }
        document.head.removeChild(this.linkElm);
        this.enabled = false;
    }
}

export default SiteThemes;