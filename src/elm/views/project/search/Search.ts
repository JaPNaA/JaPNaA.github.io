import css from "./Search.less";

import AppState from "../../../../core/types/AppState";
import ContentMan from "../../../../components/contentMan/contentMan";
import IApp from "../../../../core/types/app/IApp";
import IWithLocation from "../../../../components/contentMan/IWithLocation";
import ProjectCardInitData from "../../../widgets/ProjectCard/ProjectCardInitData";
import ProjectLink from "../../../widgets/ProjectCard/ProjectLink";
import ProjectsGrid from "../../../widgets/ProjectsGrid/ProjectsGrid";
import TfIdf from "../../../../components/tfidf/TfIdf";
import View from "../../../../core/view/View";
import removeChildren from "../../../../utils/removeChildren";
import siteConfig from "../../../../SiteConfig";
import { V2Project, V2ProjectListing } from "../../../../types/project/v2/V2Types";

type SearchTfIdf = TfIdf<number | ProjectLink>;

// todo: add ability to control how far back to search

/**
 * @viewmetadata
 * @description Like Google except worse and can only search my projects
 * @tags serach,find,projects
 */

class Search extends View {
    public cssName = css.Search;
    public isFullPage = true;

    protected elm: HTMLDivElement;

    private static queryDelay = 200;
    private static inputHeight = siteConfig.cssVars.stickyBarHeight;

    private inputContainer: HTMLDivElement;
    private inputElm: HTMLInputElement;
    private resultsContainer: HTMLDivElement;

    private projectsGrid?: ProjectsGrid;
    private tfidfCache: Map<number, SearchTfIdf>;

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
        this.tfidfCache = new Map();
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

    public getTitle(): string | undefined {
        return this.query || undefined;
    }

    public setState(state: string | undefined): boolean {
        this.query = state || "";
        this.update();
        return true;
    }

    private createInputContainer(): HTMLDivElement {
        const inputContainer = document.createElement("div");
        inputContainer.classList.add(css.inputContainer);
        return inputContainer;
    }

    private createInput(): HTMLInputElement {
        const input = document.createElement("input");
        input.classList.add(css.input);
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
            const tfidf = await this.getTfidf(year);
            const data = await ContentMan.getFileForYear(year);
            const results = tfidf.query(query);

            for (const result of results) {
                if (typeof result === "number") {
                    yield <IWithLocation<V2Project>>{
                        index: result,
                        year: year,
                        project: data.data[result] as V2Project
                    }
                } else {
                    yield result;
                }
            }
        }
    }

    private async getTfidf(year: number): Promise<SearchTfIdf> {
        const cached = this.tfidfCache.get(year);
        if (cached) {
            return cached;
        }

        const [data, links] = await Promise.all([
            ContentMan.getFileForYear(year),
            ContentMan.getLinksForYear(year)
        ]);

        const newTfidf: SearchTfIdf = this.createTfIdf(data, links);
        this.tfidfCache.set(year, newTfidf);

        return newTfidf;
    }

    private createTfIdf(data: V2ProjectListing, links: ProjectLink[]): SearchTfIdf {
        const tfidf: SearchTfIdf = new TfIdf();

        this.addV2ListingDocuments(tfidf, data);

        for (const link of links) {
            tfidf.addDocument(link, [
                [5, link.name],
                [1, link.href]
            ]);
        }

        return tfidf;
    }

    private addV2ListingDocuments(tfidf: SearchTfIdf, listing: V2ProjectListing): void {
        for (let i = 0; i < listing.data.length; i++) {
            const project = listing.data[i];
            const fields: [number, string | string[]][] = [
                [5, project.head.name],
                [5, project.head.no.toString()]
            ];

            if (project.head.tags) {
                fields.push([3, project.head.tags]);
            }
            if (project.head.author) {
                fields.push([1, project.head.author]);
            }
            if (project.head.link) {
                fields.push([1, project.head.link]);
            }
            if (project.head.shortDescription) {
                fields.push([2, project.head.shortDescription]);
            }

            tfidf.addDocument(i, fields);
        }
    }
}

export default Search;