import View from "../view";
import App from "../../../app";

class Menu extends View {
    public static viewName: string = "Menu";
    public viewName: string = Menu.viewName;

    protected elm: HTMLDivElement;
    protected isFullPage: boolean = false;

    constructor(app: App) {
        super(app);
        this.elm = document.createElement("div");
    }

    public setup() {
        super.setup();
    }

    public async destory() {
        await super.destory();
    }
}

export default Menu;