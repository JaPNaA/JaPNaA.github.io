import "../../styles/views/projectDetailed.less";

import View from "./_view";
import ICard from "../interfaces/project/card";
import CardJSONv1Elm from "../components/jsonToElm/cardV1";
import App from "../app";
import ViewMap from "./_list";
import URLManager from "../components/url/urlMan";

class ProjectDetailedView extends View {
    public static viewName = "ProjectDetailed";
    public viewName = ProjectDetailedView.viewName;

    protected elm: HTMLDivElement;
    protected isFullPage: boolean = true;

    private project?: ICard;
    private loading?: Promise<void>;

    private projectYear?: number;
    private projectIndex?: number;

    constructor(app: App, stateData?: string) {
        super(app);
        this.elm = document.createElement("div");

        if (stateData) {
            this.loading = this.loadProjectFromStateData(stateData);
        }
    }

    public setProject(project: ICard, year: number, index: number): void {
        this.project = project;
        this.projectYear = year;
        this.projectIndex = index;
    }

    private async loadProjectFromStateData(stateData: string): Promise<void> {
        const [year, index] = stateData.split(".");
        const yearInt = parseInt(year);
        const indexInt = parseInt(index);

        if (!yearInt || !indexInt) {
            throw new Error("Invalid stateData format");
        }

        this.setProject((await fetch("/content/" + year + ".json")
            .then(e => e.json())).data[index], yearInt, indexInt);

        this.loading = undefined;
    }

    public async setup(): Promise<void> {
        super.setup();

        if (this.loading) {
            await this.loading;
        }

        if (!this.project) {
            throw new Error("Project not set");
        }

        URLManager.setState(this.viewName, `${this.projectYear}.${this.projectIndex}`);

        // FOR VERSION 1 CARD
        const elm = new CardJSONv1Elm(this.project);
        elm.appendTo(this.elm);
        elm.animateTransitionIn();
        elm.addEventListeners();
    }
}

ViewMap.add(ProjectDetailedView);

export default ProjectDetailedView;