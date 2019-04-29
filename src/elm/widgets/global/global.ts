import Widget from "../widget";
import App from "../../../app/app";
import WidgetMap from "../widgetMap";
import MenuButton from "./menuButton";
import TopLoadingBar from "./topLoadingBar";

/** Initalized at start of page */
class GlobalWidgets extends Widget {
    public static widgetName: string = "GlobalWidgets";
    public widgetName: string = GlobalWidgets.widgetName;

    protected elm: HTMLDivElement;
    private app: App;

    private menuButton: MenuButton;
    private loadingBar: TopLoadingBar;

    constructor(app: App) {
        super();
        this.app = app;
        this.menuButton = new MenuButton(app);
        this.loadingBar = new TopLoadingBar(app);

        this.elm = document.createElement("div");
    }

    public setup(): void {
        super.setup();
        this.menuButton.setup();
        this.loadingBar.setup();
        this.menuButton.appendTo(this.elm);
        this.loadingBar.appendTo(this.elm);
    }

    public destory(): void {
        super.destory();
        this.menuButton.destory();
        this.loadingBar.destory();
    }
}

WidgetMap.add(GlobalWidgets);

export default GlobalWidgets;