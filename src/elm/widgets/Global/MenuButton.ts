import siteResources from "../../../core/siteResources";
import siteConfig from "../../../SiteConfig";
import IApp from "../../../core/types/app/IApp";
import Widget from "../../../core/widget/Widget";
import IMenu from "../../views/Menu/IMenu";
import ViewMap from "../../../core/view/ViewMap";

class MenuButton extends Widget {
    public static widgetName: string = "MenuButton";
    public widgetName: string = MenuButton.widgetName;

    protected elm: HTMLDivElement;
    private app: IApp;

    private static hiddenClass = "hidden";
    private static scrollBarExistsClass = "scrollBarExists";

    private isLoadingMenu: boolean;

    constructor(app: IApp) {
        super();
        this.app = app;
        this.elm = document.createElement("div");
        this.isLoadingMenu = false;
    }

    public setup() {
        super.setup();
        const img = siteResources.loadImage(siteConfig.path.img.hamburger).data;
        this.elm.appendChild(img);
        this.elm.title = "Menu (Esc)";
        this.addEventHandlers();
    }

    public destory(): void {
        super.destory();
        this.removeEventHandlers();
    }

    private addEventHandlers(): void {
        this.viewChangeHandler = this.viewChangeHandler.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);

        this.app.events.onViewChange(this.viewChangeHandler);
        this.app.events.onResize(this.viewChangeHandler);
        this.app.events.onKeydown(this.keydownHandler);

        siteResources.onDone(this.viewChangeHandler);

        this.elm.addEventListener("click", () => {
            this.toggleMenu();
        });
    }

    private removeEventHandlers(): void {
        this.app.events.offViewChange(this.viewChangeHandler);
        this.app.events.offResize(this.viewChangeHandler);
        this.app.events.offKeydown(this.keydownHandler);
        siteResources.offDone(this.viewChangeHandler);
    }

    private viewChangeHandler() {
        this.updateState();
    }

    private keydownHandler(e: KeyboardEvent): void {
        if (e.keyCode == 27) {
            this.toggleMenu();
        }
    }

    private updateState(): void {
        const topView = this.app.views.top();

        if (topView) {
            if (topView.canScroll() && !siteConfig.isMobile) {
                this.elm.classList.add(MenuButton.scrollBarExistsClass);
            } else {
                this.elm.classList.remove(MenuButton.scrollBarExistsClass);
            }

            if (topView.showMenuButton) {
                this.elm.classList.remove(MenuButton.hiddenClass);
            } else {
                this.elm.classList.add(MenuButton.hiddenClass);
            }
        } else {
            this.elm.classList.remove(MenuButton.scrollBarExistsClass);
            this.elm.classList.remove(MenuButton.hiddenClass);
        }
    }

    private toggleMenu(): void {
        if (this.isLoadingMenu) { return; }

        const existingMenu = this.app.views.getA("Menu");
        if (existingMenu) {
            this.app.views.close(existingMenu);
        } else {
            this.isLoadingMenu = true;
            this.app.views.open("Menu")
                .then(menu => (menu as IMenu).animateTransitionIn());
            this.isLoadingMenu = false;
        }
    }
}

ViewMap.prefetch("Menu");

export default MenuButton;