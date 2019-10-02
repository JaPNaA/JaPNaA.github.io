import "../../../../styles/views/Search.less";

import AppState from "../../../core/types/AppState";
import ContentMan from "../../../components/contentMan/contentMan";
import IApp from "../../../core/types/app/IApp";
import IV1InfoJSON from "../../../types/project/v1/IV1InfoJSON";
import IWithLocation from "../../../components/contentMan/IWithLocation";
import ProjectCardInitData from "../../widgets/ProjectCard/ProjectCardInitData";
import ProjectLink from "../../widgets/ProjectCard/ProjectLink";
import ProjectsGrid from "../../widgets/ProjectsGrid/ProjectsGrid";
import TfIdf from "../../../components/tfidf/TfIdf";
import V1Or2Card from "../../../components/contentMan/V1Or2Card";
import V1Or2Project from "../../../components/contentMan/V1Or2Project";
import View from "../../../core/view/View";
import ViewMap from "../../../core/view/ViewMap";
import isProjectV1Card from "../../../utils/isProjectCard";
import isV2ProjectListing from "../../../utils/v2Project/isV2ProjectListing";
import removeChildren from "../../../utils/removeChildren";
import { V2ProjectListing } from "../../../types/project/v2/V2Types";
import siteConfig from "../../../SiteConfig";

class Search extends View {
    public static viewName = "Search";
    public viewName = Search.viewName;
    public isFullPage = true;

    protected elm: HTMLDivElement;

    private static queryDelay = 200;
    private static inputHeight = siteConfig.cssVars.stickyBarHeight;

    private inputContainer: HTMLDivElement;
    private inputElm: HTMLInputElement;
    private resultsContainer: HTMLDivElement;

    private projectsGrid?: ProjectsGrid;

    private updateTimeoutHandle: number;
    private query: string;

    constructor(app: IApp, state: AppState) {
        super(app, state);

        this.query = state.stateData || "";

        this.elm = document.createElement("div");
        this.inputContainer = this.createInputContainer();
        this.inputElm = this.createInput();
        this.resultsContainer = document.createElement("div");

        this.updateTimeoutHandle = -1;
    }

    public setup() {
        super.setup();

        this.inputContainer.appendChild(this.inputElm);
        this.elm.appendChild(this.inputContainer);
        this.elm.appendChild(this.resultsContainer);

        this.inputElm.value = this.query;
        this.inputElm.focus();

        this.addEventHandlers();

        this.update();
    }

    public async destory(): Promise<void> {
        await super.destory();
        if (this.projectsGrid) {
            this.projectsGrid.destory();
        }
    }

    public getState(): string | undefined {
        if (this.query) {
            return this.query;
        }
    }

    public setState(state: string | undefined): boolean {
        this.query = state || "";
        this.update();
        return true;
    }

    private createInputContainer(): HTMLDivElement {
        const inputContainer = document.createElement("div");
        inputContainer.classList.add("inputContainer");
        return inputContainer;
    }

    private createInput(): HTMLInputElement {
        const input = document.createElement("input");
        input.classList.add("input");
        input.placeholder = "Type to search...";
        return input;
    }

    private addEventHandlers(): void {
        this.inputElm.addEventListener("input", () => {
            this.query = this.inputElm.value;
            this.updateOnTimeout();
        });

        this.events.onResize(() => {
            if (this.projectsGrid) {
                this.resizeProjectsGrid(this.projectsGrid);
            }
        });

        this.events.onKeydown(e => {
            if (e.key.length === 1) {
                this.inputElm.focus();
                e.stopPropagation();
            }
        });
    }

    private updateOnTimeout(): void {
        clearTimeout(this.updateTimeoutHandle);
        this.updateTimeoutHandle = window.setTimeout(() => {
            this.update();
        }, Search.queryDelay);
    }

    private update(): void {
        if (this.projectsGrid) {
            this.projectsGrid.destory();
            removeChildren(this.resultsContainer);
        }

        this.projectsGrid = new ProjectsGrid(this.app, this.projectsGridCallback(this.query));
        this.projectsGrid.setup();
        this.resizeProjectsGrid(this.projectsGrid);
        this.projectsGrid.appendTo(this.resultsContainer);

        this.updateState();
    }

    private resizeProjectsGrid(grid: ProjectsGrid): void {
        grid.resize(this.app.width, this.app.height - Search.inputHeight);
    }

    async *projectsGridCallback(query: string): AsyncIterableIterator<ProjectCardInitData> {
        if (this.query.trim().length <= 0) { return; }

        const index = await ContentMan.getProjectsIndex();

        for (let year = index.end; year >= index.start; year--) {
            const [data, links] = await Promise.all([
                ContentMan.getFileForYear(year),
                ContentMan.getLinksForYear(year)
            ]);
            const results = await this.queryDataAndLinks(query, data, links);

            for (const result of results) {
                if (typeof result === "number") {
                    yield <IWithLocation<V1Or2Card>>{
                        index: result,
                        year: year,
                        project: data.data[result] as V1Or2Project
                    }
                } else {
                    yield result;
                }
            }
        }
    }

    private async queryDataAndLinks(query: string, data: IV1InfoJSON | V2ProjectListing, links: ProjectLink[]): Promise<(number | ProjectLink)[]> {
        const tfidf = new TfIdf<number | ProjectLink>();

        if (isV2ProjectListing(data)) {
            this.addV2ListingDocuments(tfidf, data);
        } else {
            this.addV1ListingDocuments(tfidf, data);
        }

        for (const link of links) {
            tfidf.addDocument(link, [
                [5, link.name],
                [1, link.href]
            ]);
        }

        return tfidf.query(query);
    }

    private addV2ListingDocuments(tfidf: TfIdf<number | ProjectLink>, listing: V2ProjectListing): void {
        for (let i = 0; i < listing.data.length; i++) {
            const project = listing.data[i];

            tfidf.addDocument(i, [
                [5, project.head.name],
                [5, project.head.no.toString()],
                [2, project.head.tags || []],
                [1, project.head.author || []],
                [1, project.head.link || ""],
                [1, project.head.shortDescription || ""],
            ]);
        }
    }

    private addV1ListingDocuments(tfidf: TfIdf<number | ProjectLink>, listing: IV1InfoJSON): void {
        for (let i = 0; i < listing.data.length; i++) {
            const project = listing.data[i];
            if (!isProjectV1Card(project)) { continue; }

            tfidf.addDocument(i, [
                [5, project.name],
                [5, project.no.toString()],
                [2, project.tags],
                [1, project.author],
                [1, project.content.description],
                [1, project.content.link]
            ]);
        }
    }
}

ViewMap.add(Search);

export default Search;