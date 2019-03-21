import Widget from "../widget";
import SiteResources from "../../../siteResources";
import SiteConfig from "../../../siteConfig";
import App from "../../../app";
import Menu from "../../views/views/menu";

/** Initalized at start of page */
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
        
        this.addEventHandlers();
    }

    public destory(): void {
        this.removeEventHandlers();
    }

    private addEventHandlers(): void {
        this.viewChangeHandler = this.viewChangeHandler.bind(this);
        this.app.onViewChange(this.viewChangeHandler);

        this.elm.addEventListener("click", () => {
            this.app.openView(Menu);
        });
    }

    private removeEventHandlers(): void {
        this.app.offViewChange(this.viewChangeHandler);
    }

    private viewChangeHandler(): void {
        const topView = this.app.getTopView();
        if (topView && topView.canScroll()) {
            this.elm.classList.add("scrollBarExists");
        } else {
            this.elm.classList.remove("scrollBarExists");
        }
    }
}

export default GlobalWidget;