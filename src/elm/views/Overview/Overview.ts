import "../../../../styles/views/overview.less";

import View from "../../../core/view/view";
import ViewMap from "../../../core/view/viewMap";
import HexagonsTitle from "../../widgets/HexagonsTitle/HexagonsTitle";
import StickyBar from "../../widgets/StickyBar/StickyBar";
import SiteConfig from "../../../siteConfig";
import SiteResources from "../../../core/siteResources";
import IApp from "../../../core/types/app/iApp";
import removeChildren from "../../../utils/removeChildren";
import HTMLViewParser from "../../../components/htmlViewParser/htmlViewParser";
import IHTMLViewDocument from "../../../components/htmlViewParser/iHTMLViewDocument";

class Overview extends View {
    public static viewName = "Overview";
    public viewName = Overview.viewName;

    public isFullPage = true;

    protected elm: HTMLDivElement;
    private content: HTMLDivElement;
    private contentDocument?: IHTMLViewDocument;

    private hexagonsTitle: HexagonsTitle;

    constructor(app: IApp) {
        super(app);
        this.elm = document.createElement("div");
        this.content = this.createContent();
        this.hexagonsTitle = new HexagonsTitle(app, this.elm);
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
        if (this.contentDocument) {
            await this.contentDocument.destory();
        }
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
            scripts: true,
            dontLeavePage: true,
            openViewsWithLinks: true
        });
        this.contentDocument = parser.parse(text);
        this.contentDocument.appendTo(this.content);
    }
}

ViewMap.add(Overview);

export default Overview;