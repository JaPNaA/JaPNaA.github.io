import "../../../../styles/views/Search.less";

import View from "../../../core/view/View";
import ViewMap from "../../../core/view/ViewMap";
import IApp from "../../../core/types/app/IApp";
import AppState from "../../../core/types/AppState";
import ContentMan from "../../../components/contentMan/contentMan";
import removeChildren from "../../../utils/removeChildren";
import TfIdf from "../../../components/tfidf/TfIdf";
import isV2ProjectListing from "../../../utils/v2Project/isV2ProjectListing";
import isProjectV1Card from "../../../utils/isProjectCard";

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

        this.updateResults();
    }

    private async updateResults(): Promise<void> {
        const index = await ContentMan.getProjectsIndex();
        removeChildren(this.resultsElm);

        for (let year = index.end; year >= index.start; year--) {
            const elm = document.createElement("div");
            this.resultsElm.appendChild(elm);

            this.createResultsInYear(year)
                .then(results => elm.appendChild(results));
        }
    }

    private async createResultsInYear(year: number): Promise<HTMLDivElement> {
        const elm = document.createElement("div");
        const data = await ContentMan.getFileForYear(year);

        const tfidf = new TfIdf<string>();

        if (isV2ProjectListing(data)) {
            for (let i = 0; i < data.data.length; i++) {
                const project = data.data[i];

                tfidf.addDocument(year + "." + i, [
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

                tfidf.addDocument(year + "." + i, [
                    [5, project.name],
                    [5, project.no.toString()],
                    [2, project.tags],
                    [1, project.author],
                    [1, project.content.description],
                    [1, project.content.link]
                ]);
            }
        }


        const results = tfidf.query(this.query);
        for (const result of results) {
            elm.innerText = result;
        }

        console.log(tfidf);

        return elm;
    }
}

ViewMap.add(Search);

export default Search;