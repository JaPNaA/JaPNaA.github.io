import View from "../view";
import triggerTransitionIn from "../../../utils/triggerTransitionIn";
import wait from "../../../utils/wait";
import IApp from "../../../types/app/iApp";
import AllThingies from "./allThingies";
import ViewClass from "../../../types/viewClass";
import Overview from "./overview";

class Menu extends View {
    public static viewName: string = "Menu";
    public viewName: string = Menu.viewName;
    public isFullPage: boolean = false;

    protected elm: HTMLDivElement;

    private static transitionInTimeout: number = 600;
    private static transitionOutTimeout: number = 300;

    private contents: HTMLDivElement;
    private background: HTMLDivElement;

    constructor(app: IApp) {
        super(app);
        this.elm = document.createElement("div");
        this.background = this.createBackground();
        this.contents = this.createContents();
    }

    public setup(): void {
        super.setup();

        this.addEventHandlers();
    }

    public async destory(): Promise<void> {
        await super.destory();

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

        const children: HTMLElement[] = [
            this.createTitle(),
            this.createHeading("Navigate"),
            this.createButtonThatOpens(Overview, "Title page"),
            this.createButtonThatOpens(AllThingies, "All thingies"),
            this.createCopyright()
        ];

        for (const child of children) {
            contents.appendChild(child);
        }

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

    private createButtonThatOpens(viewClass: ViewClass, label: string): HTMLDivElement {
        const button = document.createElement("div");
        button.innerText = label;
        button.classList.add("viewButton");
        button.addEventListener("click", () => {
            this.app.views.switchAndInit(viewClass);
        });
        return button;
    }

    private createCopyright(): HTMLDivElement {
        const copyright = document.createElement("div");
        copyright.classList.add("copy");
        copyright.innerHTML = "Copyright &copy; 2019 JaPNaA"
        return copyright;
    }

    private addEventHandlers() {
        this.backgroundClickHandler = this.backgroundClickHandler.bind(this);
        this.background.addEventListener("click", this.backgroundClickHandler);
    }

    private backgroundClickHandler() {
        this.app.views.close(this);
    }
}

export default Menu;