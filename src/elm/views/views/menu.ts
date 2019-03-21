import View from "../view";
import App from "../../../app";

class Menu extends View {
    public static viewName: string = "Menu";
    public viewName: string = Menu.viewName;

    protected elm: HTMLDivElement;
    protected isFullPage: boolean = false;

    private contents: HTMLDivElement;

    constructor(app: App) {
        super(app);
        this.elm = document.createElement("div");
        this.contents = document.createElement("div");
    }

    public setup() {
        super.setup();

        this.contents.classList.add("contents");
        this.contents.innerText = "Menu [WIP]";
        this.elm.appendChild(this.contents);
    }

    public async destory() {
        await super.destory();
    }
}

export default Menu;