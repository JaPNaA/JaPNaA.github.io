import View from "../view";
import IApp from "../../../types/app/iApp";
import ViewMap from "../viewMap";
import SiteResources from "../../../siteResources";
import SiteConfig from "../../../siteConfig";
import getLink from "../../../utils/isLink";
import removeChildren from "../../../utils/removeChildren";
import { resolve, parse } from "url";
import openPopup from "../../../utils/openPopup";

// TODO: Match links with those in content/*.json and open projectinfo

class AllThingies extends View {
    public static viewName = "AllThingies";
    public viewName = AllThingies.viewName;
    protected elm: HTMLDivElement;

    public isFullPage = true;

    private static defaultTitle = "All my thingies";
    private title: HTMLDivElement;
    private pageContent: HTMLDivElement;
    private contentHref: string;

    constructor(app: IApp) {
        super(app)
        this.elm = document.createElement("div");
        this.title = this.createTitle();
        this.pageContent = this.createPageContent();
        this.contentHref = SiteConfig.path.thingy + SiteConfig.path.repo.thingy;
    }

    public async setup() {
        super.setup();

        SiteResources.loadXML(
            this.contentHref,
            "text/html"
        ).onLoad(e => this.setPageContent(e.document));

        this.addEventHandlers();
    }

    private createTitle(): HTMLHeadingElement {
        const title = document.createElement("h1");
        title.classList.add("title");
        title.innerText = AllThingies.defaultTitle;
        this.elm.appendChild(title);
        return title;
    }

    private createPageContent(): HTMLDivElement {
        const pageContent = document.createElement("div");
        pageContent.classList.add("pageContent");
        this.elm.appendChild(pageContent);
        return pageContent;
    }

    private addEventHandlers() {
        this.linkClickHandler = this.linkClickHandler.bind(this);
        this.elm.addEventListener("click", this.linkClickHandler);
    }

    private linkClickHandler(event: MouseEvent) {
        const link = getLink(event.target);
        if (link) {
            const navigated = this.navigate(link);
            event.preventDefault();

            if (navigated) {
                this.markAsLoading(event.target as HTMLElement);
            }
        }
    }

    private navigate(link: string): boolean {
        const linkParsed = parse(link);
        const isSameHost = linkParsed.hostname === location.hostname;
        const depth = this.getLinkDepth(linkParsed.path);

        if (isSameHost && depth <= 1) {
            this.contentHref = link;
            SiteResources.loadXML(link, "text/html")
                .onLoad(e => this.setPageContent(e.document));
            return true;
        } else {
            openPopup(link);
            return false;
        }
    }

    private markAsLoading(elm: HTMLElement) {
        elm.classList.add("loading");
    }

    private getLinkDepth(path?: string) {
        if (!path) { return 0; }
        const chunks = path.split("/");
        let count = 0;
        for (const chunk of chunks) {
            if (chunk) { count++; }
        }

        return count;
    }

    private setPageContent(doc: Document) {
        const elm = doc.body.children[0].cloneNode(true) as HTMLElement;
        removeChildren(this.pageContent);
        this.pageContent.appendChild(elm);
        this.setTitle(doc.title);
        this.makeLinksAbsolute(elm);
        this.app.events.dispatchViewChange();
    }

    private setTitle(title: string) {
        this.title.innerText = title || AllThingies.defaultTitle;
    }

    private makeLinksAbsolute(elm: HTMLElement) {
        const anchors = elm.getElementsByTagName("a");

        for (let i = 0; i < anchors.length; i++) {
            const anchor = anchors[i];
            const hrefAttrib = anchor.getAttribute("href");

            if (hrefAttrib) {
                anchor.href = resolve(this.contentHref, hrefAttrib);
            }
        }
    }
}

ViewMap.add(AllThingies);

export default AllThingies;