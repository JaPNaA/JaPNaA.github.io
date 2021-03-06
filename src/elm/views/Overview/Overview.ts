import css from "./Overview.less";
import commonCSS from "../../../../styles/common.less";

import View from "../../../core/view/View";
import HexagonsTitle from "../../widgets/HexagonsTitle/HexagonsTitle";
import StickyBar from "../../widgets/StickyBar/StickyBar";
import siteConfig from "../../../SiteConfig";
import siteResources from "../../../core/siteResources";
import IApp from "../../../core/types/app/IApp";
import HTMLView from "../../widgets/HTMLView/HTMLView";
import AppState from "../../../core/types/AppState";
import SaveScroll from "../../../components/viewPrivateData/saveScroll/SaveScroll";
import ISavableScroll from "../../../components/viewPrivateData/saveScroll/ISaveScrollable";
import ViewMaybeInlinedContent from "../../../core/view/components/ViewMaybeInlinedContent";

/**
 * @viewmetadata
 * @description JaPNaA's website. (It's very nice)
 */

class Overview extends View implements ISavableScroll {
    public cssName = css.Overview;
    public isFullPage = true;

    public scrollingElm: HTMLElement;

    protected elm: HTMLDivElement;
    private content: HTMLDivElement;
    private htmlView?: HTMLView;

    private hexagonsTitle: HexagonsTitle;

    private saveScroll: SaveScroll;
    private maybeInlinedContent: ViewMaybeInlinedContent =
        new ViewMaybeInlinedContent("/assets/views/overview.html");

    constructor(app: IApp, state: AppState) {
        super(app, state);
        this.elm = document.createElement("div");
        this.content = this.createContent();
        this.scrollingElm = this.elm;
        this.hexagonsTitle = new HexagonsTitle(app, this.elm);

        this.viewComponents.push(
            this.saveScroll = new SaveScroll(this, this.privateData)
        );
    }

    public setup(): void {
        super.setup();

        this.hexagonsTitle.setup();
        this.hexagonsTitle.appendToParent();
        if (siteConfig.isMobile) {
            this.hexagonsTitle.setOverSize(0, 0);
            this.hexagonsTitle.preventTransitionIn();
        } else {
            this.hexagonsTitle.setOverSize(0, 128);
        }
        this.hexagonsTitle.registerEventHandlers();

        if (this.saveScroll.hasScrolled()) {
            this.hexagonsTitle.preventTransitionIn();
        }

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

    public getPrivateData(): any {
        return super.getPrivateData();
    }

    private createStickyBar() {
        const stickyBar: StickyBar = new StickyBar();
        const logoImg: HTMLImageElement = siteResources.loadImage(siteConfig.path.img.logo).copyImage();
        const hexagonImg: HTMLImageElement = siteResources.loadImage(siteConfig.path.img.hexagon).copyImage();
        const titleElm: HTMLDivElement = document.createElement("div");

        hexagonImg.classList.add(css.hexagon);

        titleElm.appendChild(hexagonImg);
        titleElm.appendChild(logoImg);

        logoImg.alt = "JaPNaA";
        hexagonImg.alt = "";

        stickyBar.setup();
        stickyBar.appendTo(this.elm);
        stickyBar.setTitle(titleElm);
    }

    private createContent(): HTMLDivElement {
        const content = document.createElement("div");
        // content.classList.add(css.content);
        content.classList.add(commonCSS.longTextContainer);
        return content;
    }

    private loadAndWriteContent() {
        const container = document.createElement("div");
        container.classList.add(css.contentContainer);

        this.loadHTMLView(siteConfig.path.view.overview);
        container.appendChild(this.content);
        this.elm.appendChild(container);
    }

    private async loadHTMLView(url: string): Promise<void> {
        this.htmlView = new HTMLView(this.app);

        const data = await this.maybeInlinedContent.onLoadPromise();
        this.htmlView.setSource(data);
        await this.htmlView.setup();
        this.htmlView.appendTo(this.content);

        this.onLoadedHTMLView();
    }

    private onLoadedHTMLView(): void {
        this.saveScroll.apply();
        siteResources.nextIdle().then(() =>
            this.saveScroll.applyScrollDownWithTransition()
        );
    }
}

export default Overview;