import "../../../../styles/views/Menu.less";

import View from "../../../core/view/View";
import triggerTransitionIn from "../../../core/utils/triggerTransitionIn";
import wait from "../../../utils/wait";
import IApp from "../../../core/types/app/IApp";
import siteConfig from "../../../SiteConfig";
import AppState from "../../../core/types/AppState";
import SettingsWidget from "../../widgets/Settings/Settings";
import Widget from "../../../core/widget/Widget";

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
            this.createButtonThatOpens("Overview", "Title page"),
            this.createButtonThatOpens("About", "About me"),
            this.createButtonThatOpens("BrowseProjects", "Browse Projects"),
            this.createButtonThatOpens("ProjectDirectory", "Project Directory"),
            // this.createSeparator(),
            this.createSettingsWidget(),
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

    private createButtonThatOpens(viewName: string, label: string): HTMLDivElement {
        const button = document.createElement("div");
        button.classList.add("viewButton");
        const labelElm = document.createElement("div");
        labelElm.classList.add("label");
        labelElm.innerText = label;

        if (this.isTopViewA(viewName)) {
            button.classList.add("active");
            button.appendChild(this.createActiveCircle());
        }

        button.appendChild(labelElm);

        button.addEventListener("click", () => {
            this.app.views.switchAndInit(viewName);
        });

        return button;
    }

    private createSettingsWidget(): HTMLDivElement {
        const elm = document.createElement("div");
        const settings = new SettingsWidget(siteConfig.settings);
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
        const top = this.app.views.firstFullTop();
        if (!top) { return false; }
        return top.viewName === viewName;
    }
}

export default Menu;