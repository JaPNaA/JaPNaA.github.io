import "../../../../styles/views/overview.less";

import View from "../../../core/view/view";
import ViewMap from "../../../core/view/viewMap";
import HexagonsTitle from "../../widgets/HexagonsTitle/HexagonsTitle";
import StickyBar from "../../widgets/StickyBar/StickyBar";
import SiteConfig from "../../../siteConfig";
import SiteResources from "../../../core/siteResources";
import IApp from "../../../core/types/app/iApp";
import removeChildren from "../../../utils/removeChildren";
import HTMLView from "../../widgets/HTMLView/HTMLView";

class Overview extends View {
    public static viewName = "Overview";
    public viewName = Overview.viewName;

    public isFullPage = true;

    protected elm: HTMLDivElement;
    private content: HTMLDivElement;
    private htmlView?: HTMLView;

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
        if (this.htmlView) {
            await this.htmlView.destory();
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

        this.loadHTMLView(SiteConfig.path.view.overview);
        container.appendChild(this.content);
        this.elm.appendChild(container);
    }

    private loadHTMLView(url: string): void {
        this.htmlView = new HTMLView(this.app, url);
        this.htmlView.setup();
        this.htmlView.appendTo(this.content);
    }
}

ViewMap.add(Overview);

export default Overview;