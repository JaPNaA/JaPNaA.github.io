import View from "../view";
import IApp from "../../../types/app/iApp";
import ViewMap from "../viewMap";
import SiteResources from "../../../siteResources";
import SiteConfig from "../../../siteConfig";
import getLink from "../../../utils/isLink";
import removeChildren from "../../../utils/removeChildren";
import url from "url";
import openPopup from "../../../utils/open/openPopup";
import FrameView from "./frameView";
import contentJSONPath from "../../../utils/paths/contentJson";
import IInfoJSON from "../../../types/project/infojson";
import isProjectCard from "../../../utils/isProjectCard";
import ICard from "../../../types/project/card";
import JSONResource from "../../../components/resourceLoader/resources/json";
import ProjectInfoView from "./projectInfo";
import AppState from "../../../types/appState";
import createViewState from "../../../utils/createViewState";
import openFrameView from "../../../utils/open/openFrameView";

type LinkMatch = {
    year: number,
    index: number,
    data: ICard
};

class AllThingies extends View {
    public static viewName = "AllThingies";
    public viewName = AllThingies.viewName;
    protected elm: HTMLDivElement;

    public isFullPage = true;

    private static defaultTitle = "All my thingies";
    private title: HTMLDivElement;
    private pageContent: HTMLDivElement;
    private contentHref: string;
    private linkProjectMatchMap: Map<string, LinkMatch | undefined>;

    constructor(app: IApp, state: AppState) {
        super(app)
        this.elm = document.createElement("div");
        this.title = this.createTitle();
        this.pageContent = this.createPageContent();
        this.linkProjectMatchMap = new Map();

        if (state.stateData) {
            this.contentHref = SiteConfig.path.thingy + "/" + state.stateData + "/";
        } else {
            this.contentHref = SiteConfig.path.thingy + SiteConfig.path.repo.thingy;
        }
    }

    public async setup() {
        super.setup();

        SiteResources.loadXML(
            this.contentHref,
            "text/html"
        ).onLoad(e => this.setPageContent(e.document));

        this.addEventHandlers();
    }

    public getState(): string {
        return this.cleanPath();
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

    private cleanPath(): string {
        const urlParsed = url.parse(this.contentHref);
        let path = urlParsed.path;

        if (path) {
            if (path.startsWith("/")) {
                path = path.slice(1);
            }
            if (path.endsWith("/")) {
                path = path.slice(0, path.length - 1);
            }
            return path;
        } else {
            return "";
        }
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

    private markAsLoading(elm: HTMLElement) {
        elm.classList.add("loading");
    }

    private navigate(link: string): boolean {
        const linkParsed = url.parse(link);
        const isSameHost = linkParsed.hostname === location.hostname;
        const depth = this.getPathDepth(linkParsed.path);

        if (isSameHost) {
            if (depth <= 1) {
                this.changeContentToView(link);
                return true;
            } else {
                this.handleNavigateProjectLink(link);
                return false;
            }
        } else {
            openPopup(link);
            return false;
        }
    }

    private handleNavigateProjectLink(link: string): void {
        const match = this.linkProjectMatchMap.get(link);
        if (match) {
            this.openProjectView(match);
        } else {
            openFrameView(this.app, link);
        }
    }

    private getPathDepth(path?: string) {
        if (!path) { return 0; }
        const chunks = path.split("/");
        let count = 0;
        for (const chunk of chunks) {
            if (chunk) { count++; }
        }

        return count;
    }

    private changeContentToView(link: string): void {
        this.app.url.pushHistory(this);
        this.contentHref = link;
        SiteResources.loadXML(link, "text/html")
            .onLoad(e => this.setPageContent(e.document));
    }

    private openProjectView(match: LinkMatch): void {
        const view = new ProjectInfoView(this.app, createViewState(ProjectInfoView));
        view.setProject(match.data, match.year, match.index);
        view.setup();
        this.app.views.add(view);
    }

    private setPageContent(doc: Document) {
        const elm = doc.body.children[0].cloneNode(true) as HTMLElement;
        removeChildren(this.pageContent);
        this.pageContent.appendChild(elm);
        this.setTitle(doc.title);
        this.transformLinks(elm);
        this.app.events.dispatchViewChange();
    }

    private setTitle(title: string) {
        this.title.innerText = title || AllThingies.defaultTitle;
    }

    private transformLinks(elm: HTMLElement) {
        const anchors = elm.getElementsByTagName("a");

        for (let i = 0; i < anchors.length; i++) {
            const anchor = anchors[i];
            const hrefAttrib = anchor.getAttribute("href");

            if (hrefAttrib) {
                const href = url.resolve(this.contentHref, hrefAttrib);
                anchor.href = href;
                this.mapLinkToProject(href);
            }
        }
    }

    private mapLinkToProject(href: string) {
        const path = url.parse(href).path;
        const depth = this.getPathDepth(path);

        if (depth === 2) {
            this.findMatchingEntry(href)
                .then(e => this.linkProjectMatchMap.set(href, e));
        }
    }

    private async findMatchingEntry(link: string): Promise<LinkMatch | undefined> {
        const year = this.getYear(link);

        if (!year) { return; }

        const data: JSONResource | null = await new Promise((res, rej) =>
            SiteResources.loadJSON(contentJSONPath(year))
                .onLoad(e => res(e))
                .onError(e => res(null))
        );
        if (!data) { return; }
        const content = data.data as IInfoJSON;

        for (let i = 0; i < content.data.length; i++) {
            const entry = content.data[i];
            if (!isProjectCard(entry)) { continue; }
            const entryLink = url.resolve(SiteConfig.path.thingy, entry.content.link);
            if (entryLink === link) {
                return {
                    year: parseInt(year),
                    index: i,
                    data: entry
                };
            }
        }

        return;
    }

    private getYear(link: string): string | null {
        const year = link.match(/Thingy_(\d+)/);
        if (year) {
            return year[1];
        } else {
            return null;
        }
    }
}

ViewMap.add(AllThingies);

export default AllThingies;