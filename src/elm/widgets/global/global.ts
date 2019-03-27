import Widget from "../widget";
import SiteResources from "../../../siteResources";
import SiteConfig from "../../../siteConfig";
import App from "../../../app";
import Menu from "../../views/views/menu";
import WidgetMap from "../widgetMap";

/** Initalized at start of page */
class GlobalWidget extends Widget {
    public static widgetName: string = "GlobalWidget";
    public widgetName: string = GlobalWidget.widgetName;

    protected elm: HTMLDivElement;

    private static hiddenClass = "hidden";
    private static scrollBarExistsClass = "scrollBarExists";
    private app: App;

    constructor(app: App) {
        super();
        this.app = app;

        this.elm = document.createElement("div");
    }

    public setup(): void {
        const img = SiteResources.loadImage(SiteConfig.path.img.hamburger).image;
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
            const menu = new Menu(this.app);
            menu.setup();
            menu.animateTransitionIn();
            this.app.addView(menu);
        });
    }

    private removeEventHandlers(): void {
        this.app.offViewChange(this.viewChangeHandler);
    }

    private viewChangeHandler(): void {
        const topView = this.app.getTopView();

        if (topView) {
            if (topView.canScroll()) {
                this.elm.classList.add(GlobalWidget.scrollBarExistsClass);
            } else {
                this.elm.classList.remove(GlobalWidget.scrollBarExistsClass);
            }

            if (topView.showGlobalWidget) {
                this.elm.classList.remove(GlobalWidget.hiddenClass);
            } else {
                this.elm.classList.add(GlobalWidget.hiddenClass);
            }
        } else {
            this.elm.classList.remove(GlobalWidget.scrollBarExistsClass);
            this.elm.classList.remove(GlobalWidget.hiddenClass);
        }
    }
}

WidgetMap.add(GlobalWidget);

export default GlobalWidget;