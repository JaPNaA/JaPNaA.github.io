import View from "../view";
import ViewMap from "../viewMap";
import HexagonsTitle from "../../widgets/hexagonsTitle/hexagonsTitle";
import StickyBar from "../../widgets/stickyBar/stickyBar";
import SiteConfig from "../../../siteConfig";
import SiteResources from "../../../siteResources";
import htmlViewParse from "../../../components/htmlViewParser/htmlViewParser";
import IApp from "../../../types/app/iApp";

class Overview extends View {
    public static viewName = "Overview";
    public viewName = Overview.viewName;

    public isFullPage = true;

    protected elm: HTMLDivElement;

    private hexagonsTitle: HexagonsTitle;

    constructor(app: IApp) {
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

        this.createStickyBar();
        this.createContent();
    }

    public async destory(): Promise<void> {
        super.destory();
        this.hexagonsTitle.destory();
    }

    private createStickyBar() {
        const stickyBar: StickyBar = new StickyBar();
        const logoImg: HTMLImageElement = SiteResources.loadImage(SiteConfig.path.img.logo).copyImage();
        const hexagonImg: HTMLImageElement = SiteResources.loadImage(SiteConfig.path.img.hexagon).copyImage();
        const titleElm: HTMLDivElement = document.createElement("div");

        hexagonImg.classList.add("hexagon");

        titleElm.appendChild(hexagonImg);
        titleElm.appendChild(logoImg);

        stickyBar.setup();
        stickyBar.appendTo(this.elm);
        stickyBar.setTitle(titleElm);
    }

    private createContent() {
        const container = document.createElement("div");
        container.classList.add("contentContainer");

        const content = document.createElement("div");
        content.classList.add("content");
        content.appendChild(document.createTextNode("Loading..."));

        SiteResources.loadText(SiteConfig.path.view.overview)
            .onLoad(e => content.appendChild(
                htmlViewParse(this.app, e.text || "Failed to load", { inlineJS: true, scripts: true })
            ))
            .onError(() => content.innerHTML = "Failed to load");

        container.appendChild(content);
        this.elm.appendChild(container);
    }
}

ViewMap.add(Overview);

export default Overview;