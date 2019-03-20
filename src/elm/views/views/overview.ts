import View from "../view";
import App from "../../../app";
import ViewMap from "../list";
import HexagonsTitle from "../../widgets/hexagonsTitle/hexagonsTitle";
import StickyBar from "../../widgets/stickyBar/stickyBar";
import SiteConfig from "../../../siteConfig";
import SiteResources from "../../../siteResources";
import ImageResource from "../../../components/resourceLoader/resources/image";

class Overview extends View {
    public static viewName = "Overview";
    public viewName = Overview.viewName;

    public isFullPage = true;

    protected elm: HTMLDivElement;

    private hexagonsTitle: HexagonsTitle;

    constructor(app: App) {
        super(app);
        this.elm = document.createElement("div");
        this.hexagonsTitle = new HexagonsTitle(this.elm);
    }

    public setup(): void {
        super.setup();

        this.hexagonsTitle.setup();
        this.hexagonsTitle.appendToParent();
        this.hexagonsTitle.setOverSize(0, 128);
        this.hexagonsTitle.registerEventHandlers();

        const stickyBar: StickyBar = new StickyBar();
        const logoResource: ImageResource = SiteResources.loadImage(SiteConfig.paths.logo);
        
        stickyBar.setup();
        stickyBar.appendTo(this.elm);
        stickyBar.setText(logoResource.image);

        this.createContent();
    }

    private createContent() {
        const content = document.createElement("div");
        content.classList.add("content");
        content.appendChild(document.createTextNode("asdf ".repeat(2000)));
        this.elm.appendChild(content);
    }

    public async destory(): Promise<void> {
        super.destory();
        this.hexagonsTitle.destory();
    }
}

ViewMap.add(Overview);

export default Overview;