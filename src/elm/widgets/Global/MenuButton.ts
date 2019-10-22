import css from "./menuButton.less";

import siteResources from "../../../core/siteResources";
import siteConfig from "../../../SiteConfig";
import IApp from "../../../core/types/app/IApp";
import Widget from "../../../core/widget/Widget";
import IMenu from "../../views/Menu/IMenu";
import resolveUrl from "../../../utils/resolveUrl";
import keyIsModified from "../../../utils/keyIsModified";

class MenuButton extends Widget {
    public cssName: string = css.MenuButton;

    protected elm: HTMLDivElement;
    private app: IApp;

    private anchor: HTMLAnchorElement;

    private static hiddenClass = css.hidden;
    private static scrollBarExistsClass = css.scrollBarExists;

    private isLoadingMenu: boolean;

    constructor(app: IApp) {
        super();
        this.app = app;
        this.elm = document.createElement("div");
        this.anchor = document.createElement("a");
        this.isLoadingMenu = false;
    }

    public setup() {
        super.setup();

        const img = siteResources.loadImage(siteConfig.path.img.hamburger).copyImage();
        img.alt = "Menu icon";

        this.anchor.appendChild(img);
        this.anchor.title = "Menu (Esc)";
        this.anchor.href = resolveUrl("/menu");
        this.elm.appendChild(this.anchor);

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

        this.anchor.addEventListener("click", e => {
            if (keyIsModified(e)) { return; }
            e.preventDefault();
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
        if (e.cancelBubble) { return; }
        if (e.keyCode === 27) {
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

export default MenuButton;