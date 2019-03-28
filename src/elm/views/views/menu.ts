import View from "../view";
import triggerTransitionIn from "../../../utils/triggerTransitionIn";
import wait from "../../../utils/wait";
import IApp from "../../../types/app";
import AllProjects from "./allProjects";

class Menu extends View {
    public static viewName: string = "Menu";
    public viewName: string = Menu.viewName;

    protected elm: HTMLDivElement;
    protected isFullPage: boolean = false;

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
        contents.innerText = "This the menu! Close button should be there -->\nBut I haven't added that, you can still close by clicking\n<-- over there";

        const button = document.createElement("button");
        button.innerText = "All projects";
        button.addEventListener("click", () => {
            this.app.switchAndInitView(AllProjects);
        });
        contents.appendChild(button);

        this.elm.appendChild(contents);
        return contents;
    }

    private addEventHandlers() {
        this.backgroundClickHandler = this.backgroundClickHandler.bind(this);
        this.background.addEventListener("click", this.backgroundClickHandler);
    }

    private backgroundClickHandler() {
        this.app.closeView(this);
    }
}

export default Menu;