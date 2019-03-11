import View from "./_view";
import App from "../app";
import ViewMap from "./_list";
import HexagonsTitle from "../components/hexagonsTitle/hexagonsTitle";
import StickyBar from "../components/stickyBar/stickyBar";
import SiteConfig from "../siteConfig";
import SiteResources from "../siteResources";
import ImageResource from "../components/resourceLoader/resources/image";

class Overview extends View {
    public static viewName = "Overview";
    public viewName = Overview.viewName;

    public isFullPage = true;

    protected elm: HTMLDivElement;

    private hexagonsTitle: HexagonsTitle;

    constructor(app: App) {
        super(app);
        this.elm = document.createElement("div");
        this.hexagonsTitle = new HexagonsTitle();
    }

    public setup(): void {
        super.setup();

        this.hexagonsTitle.appendTo(this.elm);
        this.hexagonsTitle.setOverSize(0, 128);
        this.hexagonsTitle.registerEventHandlers();

        const stickyBar: StickyBar = new StickyBar();
        const logoResource: ImageResource = SiteResources.loadImage(SiteConfig.paths.logo);

        stickyBar.appendTo(this.elm);
        stickyBar.setText(logoResource.image);

        this.elm.appendChild(document.createTextNode("asdf ".repeat(10000)));
    }

    public async destory(): Promise<void> {
        super.destory();
        this.hexagonsTitle.destory();
    }
}

ViewMap.add(Overview);

export default Overview;