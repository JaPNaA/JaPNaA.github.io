import "../../../../styles/views/ProjectDirectory.less";

import AppState from "../../../core/types/AppState";
import ContentMan from "../../../components/contentMan/contentMan";
import createAppState from "../../../core/utils/createAppState";
import getLink from "../../../utils/getLink";
import IApp from "../../../core/types/app/IApp";
import IProjectInfoView from "../ProjectInfo/IProjectInfo";
import isProjectV1Card from "../../../utils/isProjectCard";
import isV2Project from "../../../utils/v2Project/isV2Project";
import openFrameView from "../../../utils/view/openFrameView";
import openPopup from "../../../core/utils/open/openPopup";
import removeChildren from "../../../utils/removeChildren";
import siteConfig from "../../../SiteConfig";
import siteResources from "../../../core/siteResources";
import url from "url";
import V1Or2Card from "../../../components/contentMan/V1Or2Card";
import View from "../../../core/view/View";
import ViewMap from "../../../core/view/ViewMap";

type LinkMatch = {
    year: number,
    index: number,
    data: V1Or2Card
};

class ProjectDirectory extends View {
    public static viewName = "ProjectDirectory";
    public viewName = ProjectDirectory.viewName;
    public isFullPage = true;

    protected elm: HTMLDivElement;
    protected container: HTMLDivElement;

    private static defaultTitle = "Project directory";
    private title: HTMLDivElement;
    private pageContent: HTMLDivElement;
    private contentHref: string;
    private linkProjectMatchMap: Map<string, LinkMatch | undefined>;

    constructor(app: IApp, state: AppState) {
        super(app, state);
        this.elm = document.createElement("div");
        this.container = this.createContainer();
        this.title = this.createTitle();
        this.pageContent = this.createPageContent();
        this.linkProjectMatchMap = new Map();

        if (state.stateData) {
            this.contentHref = siteConfig.path.thingy + "/" + state.stateData + "/";
        } else {
            this.contentHref = siteConfig.path.thingy + siteConfig.path.repo.thingy;
        }
    }

    public async setup() {
        super.setup();

        siteResources.loadXML(
            this.contentHref,
            "text/html"
        ).onLoad(e => this.setPageContent(e.data));

        this.elm.appendChild(this.container);

        this.addEventHandlers();
    }

    public getState(): string {
        return this.cleanPath();
    }

    private createContainer(): HTMLDivElement {
        const container = document.createElement("div");
        container.classList.add("longTextContainer");
        return container;
    }

    private createTitle(): HTMLHeadingElement {
        const title = document.createElement("h1");
        title.classList.add("title");
        title.innerText = ProjectDirectory.defaultTitle;
        this.container.appendChild(title);
        return title;
    }

    private createPageContent(): HTMLDivElement {
        const pageContent = document.createElement("div");
        pageContent.classList.add("pageContent");
        this.container.appendChild(pageContent);
        return pageContent;
    }

    private addEventHandlers() {
        this.linkClickHandler = this.linkClickHandler.bind(this);
        this.container.addEventListener("click", this.linkClickHandler);
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
        siteResources.loadXML(link, "text/html")
            .onLoad(e => this.setPageContent(e.data));
    }

    private async openProjectView(match: LinkMatch): Promise<void> {
        const ProjectInfo = await ViewMap.get("ProjectInfo");
        const view = new ProjectInfo(this.app, createAppState(ProjectInfo)) as IProjectInfoView;
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
        this.title.innerText = title || ProjectDirectory.defaultTitle;
    }

    private transformLinks(elm: HTMLElement) {
        const anchors = elm.getElementsByTagName("a");

        for (let i = 0; i < anchors.length; i++) {
            const anchor = anchors[i];
            const hrefAttrib = anchor.getAttribute("href");

            if (hrefAttrib) {
                const href = url.resolve(this.contentHref, hrefAttrib);
                anchor.href = href;
                this.mapLinkToProject(href)
                    .then(e => { if (e) { anchor.classList.add("hasProjectInfo"); } });
            }
        }
    }

    /**
     * @returns sucessful?
     */
    private mapLinkToProject(href: string): Promise<boolean> {
        const path = url.parse(href).path;
        const depth = this.getPathDepth(path);
        const prom = new Promise<boolean>(res => {
            if (depth === 2) {
                this.findMatchingEntry(href)
                    .then(e => {
                        this.linkProjectMatchMap.set(href, e);
                        res(Boolean(e));
                    });
            } else {
                res(false);
            }
        });

        return prom;
    }

    private async findMatchingEntry(link: string): Promise<LinkMatch | undefined> {
        const year = this.getYear(link);

        if (!year) { return; }

        const { data } = await ContentMan.getFileForYear(year);
        if (!data) { return; }

        for (let i = 0; i < data.length; i++) {
            const entry = data[i];
            if (isProjectV1Card(entry)) {
                const entryLink = url.resolve(siteConfig.path.thingy, entry.content.link);
                if (entryLink === link) {
                    return {
                        year: parseInt(year),
                        index: i,
                        data: entry
                    };
                }
            } else if (isV2Project(entry) && entry.head.link) {
                const entryLink = url.resolve(siteConfig.path.thingy, entry.head.link);
                if (entryLink === link) {
                    return {
                        year: parseInt(year),
                        index: i,
                        data: entry
                    };
                }
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

ViewMap.add(ProjectDirectory);

export default ProjectDirectory;