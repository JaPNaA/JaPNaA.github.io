import View from "../view";
import ICard from "../../../types/project/card";
import CardJSONv1Elm from "../../../components/jsonToElm/cardV1";
import App from "../../../app";
import ViewMap from "../list";
import URLManager from "../../../components/url/urlMan";
import SiteConfig from "../../../siteConfig";

class ProjectInfoView extends View {
    public static viewName = "ProjectInfo";
    public viewName = ProjectInfoView.viewName;

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
        const yearInt: number = parseInt(year);
        const indexInt: number = parseInt(index);

        if (!yearInt || !indexInt) {
            throw new Error("Invalid stateData format");
        }

        this.setProject((await fetch(SiteConfig.path.content + year + ".json")
            .then(e => e.json())).data[index], yearInt, indexInt);

        this.loading = undefined;
    }

    protected updateStateURL(): void {
        if (this.projectIndex !== undefined && this.projectYear !== undefined) {
            URLManager.setState(this.viewName, `${this.projectYear}.${this.projectIndex}`);
        } else {
            URLManager.setState(this.viewName);
        }
    }

    public async setup(): Promise<void> {
        super.setup();

        if (this.loading) {
            await this.loading;
        }

        if (!this.project) {
            throw new Error("Project not set");
        }

        this.updateStateURL();

        // FOR VERSION 1 CARD
        const elm: CardJSONv1Elm = new CardJSONv1Elm(this.project);
        elm.appendTo(this.elm);
        elm.animateTransitionIn();
        elm.addEventListeners();
    }
}

ViewMap.add(ProjectInfoView);

export default ProjectInfoView;