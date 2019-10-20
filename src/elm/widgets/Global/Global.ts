
import "../../../../styles/widgets/global/global.less"

import Widget from "../../../core/widget/Widget";
import App from "../../../App";
import MenuButton from "./MenuButton";
import TopLoadingBar from "./TopLoadingBar";
import GlobalKeybindings from "./GlobalKeybindings";

/** Initalized at start of page */
class GlobalWidgets extends Widget {
    public static widgetName: string = "GlobalWidgets";
    public widgetName: string = GlobalWidgets.widgetName;

    protected elm: HTMLDivElement;
    private app: App;

    private menuButton: MenuButton;
    private loadingBar: TopLoadingBar;

    private globalKeybindings: GlobalKeybindings;

    constructor(app: App) {
        super();
        this.app = app;

        this.globalKeybindings = new GlobalKeybindings(app);

        this.menuButton = new MenuButton(app);
        this.loadingBar = new TopLoadingBar(app);

        this.elm = document.createElement("div");
    }

    public setup(): void {
        super.setup();
        this.globalKeybindings.setup();

        this.menuButton.setup();
        this.loadingBar.setup();
        this.menuButton.appendTo(this.elm);
        this.loadingBar.appendTo(this.elm);
    }

    public destory(): void {
        super.destory();
        this.globalKeybindings.setup();

        this.menuButton.destory();
        this.loadingBar.destory();
    }
}

export default GlobalWidgets;