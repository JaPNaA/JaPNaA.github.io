import Widget from "../widget";
import SiteResources from "../../../siteResources";
import SiteConfig from "../../../siteConfig";
import App from "../../../app";

class GlobalWidget extends Widget {
    public widgetName: string = "GlobalWidget";
    protected elm: HTMLDivElement;
    private app: App;

    constructor(app: App) {
        super();
        this.app = app;

        this.elm = document.createElement("div");
    }

    public setup(): void {
        const img = SiteResources.loadImage(SiteConfig.paths.hamburger).image;
        this.elm.appendChild(img);
        super.setup();
        // this.app.onViewChange(() => console.log("vc"));
    }
}

export default GlobalWidget;