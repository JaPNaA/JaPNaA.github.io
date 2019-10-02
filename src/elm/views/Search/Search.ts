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

class Search extends View {
    public static viewName = "Search";
    public viewName = Search.viewName;
    public isFullPage = true;

    protected elm: HTMLDivElement;

    private inputElm: HTMLInputElement;
    private resultsElm: HTMLDivElement;

    private query: string;

    constructor(app: IApp, state: AppState) {
        super(app, state);

        this.query = state.stateData || "";

        this.elm = document.createElement("div");
        this.inputElm = document.createElement("input");
        this.resultsElm = document.createElement("div");
    }

    public setup() {
        super.setup();

        this.elm.appendChild(this.inputElm);
        this.elm.appendChild(this.resultsElm);
        this.update();
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

    private update(): void {
        this.inputElm.value = this.query;

        const projectsGrid = new ProjectsGrid(this.app, this.projectsGridCallback(this.query));
        projectsGrid.setup();
        projectsGrid.resize(this.app.width, this.app.height);
        projectsGrid.appendTo(this.elm);
    }

    async *projectsGridCallback(query: string): AsyncIterableIterator<ProjectCardInitData> {
        const index = await ContentMan.getProjectsIndex();
        removeChildren(this.resultsElm);

        if (this.query.trim().length <= 0) { return; }

        for (let year = index.end; year >= index.start; year--) {
            const elm = document.createElement("div");
            this.resultsElm.appendChild(elm);

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
            for (let i = 0; i < data.data.length; i++) {
                const project = data.data[i];

                tfidf.addDocument(i, [
                    [5, project.head.name],
                    [5, project.head.no.toString()],
                    [2, project.head.tags || []],
                    [1, project.head.author || []],
                    [1, project.head.link || ""],
                    [1, project.head.shortDescription || ""],
                ]);
            }
        } else {
            for (let i = 0; i < data.data.length; i++) {
                const project = data.data[i];
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

        for (const link of links) {
            tfidf.addDocument(link, [
                [5, link.name],
                [1, link.href]
            ]);
        }

        return tfidf.query(this.query);
    }
}

ViewMap.add(Search);

export default Search;