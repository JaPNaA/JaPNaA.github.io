import "../../../../styles/views/Menu.less";

import View from "../../../core/view/View";
import triggerTransitionIn from "../../../core/utils/triggerTransitionIn";
import wait from "../../../utils/wait";
import IApp from "../../../core/types/app/IApp";
import siteConfig from "../../../SiteConfig";
import AppState from "../../../core/types/AppState";
import SiteSettingsWidget from "../../widgets/Settings/Settings";
import Widget from "../../../core/widget/Widget";
import resolveUrl from "../../../utils/resolveUrl";

class Menu extends View {
    public static viewName: string = "Menu";
    public viewName: string = Menu.viewName;
    public isFullPage: boolean = false;

    protected elm: HTMLDivElement;

    private static transitionInTimeout: number = 600;
    private static transitionOutTimeout: number = 300;

    private contents: HTMLDivElement;
    private background: HTMLDivElement;
    private widgets: Widget[];

    constructor(app: IApp, state: AppState) {
        super(app, state);
        this.elm = document.createElement("div");
        this.widgets = [];

        this.background = this.createBackground();
        this.contents = this.createContents();
    }

    public setup(): void {
        super.setup();

        this.addEventHandlers();
    }

    public async destory(): Promise<void> {
        await super.destory();

        for (const widget of this.widgets) {
            widget.destory();
        }

        this.background.removeEventListener("click", this.backgroundClickHandler);
        await wait(Menu.transitionOutTimeout);
    }

    public animateTransitionIn(): void {
        triggerTransitionIn(this.elm, Menu.transitionInTimeout)
    }

    private createBackground(): HTMLDivElement {
        const background = document.createElement("div");
        background.classList.add("background");

        this.elm.appendChild(background);
        return background;
    }

    private createContents(): HTMLDivElement {
        const contents = document.createElement("div");
        contents.classList.add("contents");

        const scrollContainer = document.createElement("div");
        scrollContainer.classList.add("scrollContainer");

        const children: HTMLElement[] = [
            this.createTitle(),
            this.createHeading("Navigate"),
            this.createNavButtonTo("Overview", "Title page"),
            this.createNavButtonTo("About", "About me"),
            this.createNavButtonTo("BrowseProjects", "Browse Projects"),
            this.createNavButtonTo("ProjectDirectory", "Project Directory"),
            this.createSettingsWidget(),
            this.createHeading("Misc"),
            this.createButtonThatReplacesMenuWith("CommandPalette", "Command Palette"),
            this.createCopyright()
        ];

        for (const child of children) {
            scrollContainer.appendChild(child);
        }

        contents.appendChild(scrollContainer);
        this.elm.appendChild(contents);
        return contents;
    }

    private createTitle(): HTMLHeadingElement {
        const title = document.createElement("h1");
        title.classList.add("title");
        title.innerText = "Menu";
        return title;
    }

    private createHeading(label: string): HTMLHeadElement {
        const heading = document.createElement("h2");
        heading.classList.add("heading");
        heading.innerText = label;
        return heading;
    }

    private createSeparator(): HTMLHRElement {
        const hr = document.createElement("hr");
        hr.classList.add("separator");
        return hr;
    }

    private createNavButtonTo(viewName: string, label: string): HTMLAnchorElement {
        return this.createViewButton(viewName, label, e => {
            this.app.views.switchAndInit(viewName);
        });
    }

    private createButtonThatReplacesMenuWith(viewName: string, label: string): HTMLAnchorElement {
        return this.createViewButton(viewName, label, e => {
            this.app.views.close(this);
            this.app.views.open(viewName, "/");
        });
    }

    private createViewButton(viewName: string, label: string, clickHandler: (e: MouseEvent) => void): HTMLAnchorElement {
        const anchor = document.createElement("a");
        anchor.classList.add("viewButton");
        anchor.href = resolveUrl("/" + viewName.toLowerCase());

        const labelElm = document.createElement("div");
        labelElm.classList.add("label");
        labelElm.innerText = label;

        if (this.isTopViewA(viewName)) {
            anchor.classList.add("active");
            anchor.appendChild(this.createActiveCircle());
        }

        anchor.appendChild(labelElm);
        anchor.addEventListener("click", e => {
            if (e.ctrlKey || e.shiftKey || e.altKey) { return; }
            e.preventDefault();
            clickHandler(e);
        });
        return anchor;
    }

    private createSettingsWidget(): HTMLDivElement {
        const elm = document.createElement("div");
        const settings = new SiteSettingsWidget();
        elm.classList.add("settingsContainer");
        settings.setup();
        settings.appendTo(elm);
        this.widgets.push(settings);
        return elm;
    }

    private createActiveCircle(): HTMLDivElement {
        const circle = document.createElement("div");
        circle.classList.add("circle");
        return circle;
    }

    private createCopyright(): HTMLDivElement {
        const copyright = document.createElement("div");
        copyright.classList.add("copy");
        siteConfig.getServerTime()
            .then(e => copyright.innerHTML = `Copyright &copy; ${e.getUTCFullYear()} JaPNaA`);
        return copyright;
    }

    private addEventHandlers() {
        this.backgroundClickHandler = this.backgroundClickHandler.bind(this);
        this.background.addEventListener("click", this.backgroundClickHandler);
    }

    private backgroundClickHandler() {
        this.app.views.close(this);
    }

    private isTopViewA(viewName: string): boolean {
        const top = this.app.views.topFull();
        if (!top) { return false; }
        return top.viewName === viewName;
    }
}

export default Menu;