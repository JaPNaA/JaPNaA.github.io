import Widget from "../widget";
import App from "../../../app/app";
import WidgetMap from "../widgetMap";
import MenuButton from "./menuButton";

/** Initalized at start of page */
class GlobalWidgets extends Widget {
    public static widgetName: string = "GlobalWidgets";
    public widgetName: string = GlobalWidgets.widgetName;

    protected elm: HTMLDivElement;
    private app: App;

    private menuButton: MenuButton;

    constructor(app: App) {
        super();
        this.app = app;
        this.menuButton = new MenuButton(app);

        this.elm = document.createElement("div");
    }

    public setup(): void {
        super.setup();
        this.menuButton.setup();
        this.menuButton.appendTo(this.elm);
    }

    public destory(): void {
        super.destory();
        this.menuButton.destory();
    }
}

WidgetMap.add(GlobalWidgets);

export default GlobalWidgets;