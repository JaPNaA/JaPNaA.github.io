import View from "../view";
import ViewMap from "../viewMap";
import HexagonsTitle from "../../widgets/hexagonsTitle/hexagonsTitle";
import StickyBar from "../../widgets/stickyBar/stickyBar";
import SiteConfig from "../../../siteConfig";
import SiteResources from "../../../siteResources";
import IApp from "../../../types/app/iApp";
import removeChildren from "../../../utils/removeChildren";
import HTMLViewParser from "../../../components/htmlViewParser/htmlViewParser";

class Overview extends View {
    public static viewName = "Overview";
    public viewName = Overview.viewName;

    public isFullPage = true;

    protected elm: HTMLDivElement;
    private content: HTMLDivElement;

    private hexagonsTitle: HexagonsTitle;

    constructor(app: IApp) {
        super(app);
        this.elm = document.createElement("div");
        this.content = this.createContent();
        this.hexagonsTitle = new HexagonsTitle(this.elm);
    }

    public setup(): void {
        super.setup();

        this.hexagonsTitle.setup();
        this.hexagonsTitle.appendToParent();
        this.hexagonsTitle.setOverSize(0, 128);
        this.hexagonsTitle.registerEventHandlers();

        this.createStickyBar();
        this.loadAndWriteContent();
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

    private createContent(): HTMLDivElement {
        const content = document.createElement("div");
        content.classList.add("content");
        return content;
    }

    private loadAndWriteContent() {
        const container = document.createElement("div");
        container.classList.add("contentContainer");
        this.content.appendChild(document.createTextNode("Loading..."));

        SiteResources.loadText(SiteConfig.path.view.overview)
            .onLoad(e => {
                this.writeContent(e.text);
            })
            .onError(() => this.content.innerHTML = "Failed to load");

        container.appendChild(this.content);
        this.elm.appendChild(container);
    }

    private writeContent(text?: string): void {
        removeChildren(this.content);

        if (!text) {
            this.content.appendChild(document.createTextNode("Failed to load"));
            return;
        }

        const parser = new HTMLViewParser(this.app, {
            inlineJS: true,
            scripts: true
        });
        const doc = parser.parse(text);
        doc.appendTo(this.content);
    }
}

ViewMap.add(Overview);

export default Overview;