import View from "../view";
import ICard from "../../../types/project/card";
import CardJSONv1Elm from "../../../components/jsonToElm/cardV1";
import ViewMap from "../viewMap";
import URLManager from "../../../components/url/urlMan";
import SiteConfig from "../../../siteConfig";
import IApp from "../../../types/app";
import SiteResources from "../../../siteResources";
import IInfoJSON from "../../../types/infojson";

class ProjectInfoView extends View {
    public static viewName = "ProjectInfo";
    public viewName = ProjectInfoView.viewName;

    protected elm: HTMLDivElement;
    protected isFullPage: boolean = true;

    private project?: ICard;
    private loadingPromise?: Promise<void>;

    private projectYear?: number;
    private projectIndex?: number;

    constructor(app: IApp, stateData?: string) {
        super(app);
        this.elm = document.createElement("div");

        if (stateData) {
            this.loadingPromise = this.loadProjectFromStateData(stateData);
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

        this.setProject(await this.getCard(year, indexInt), yearInt, indexInt);

        this.loadingPromise = undefined;
    }

    protected updateStateURL(): void {
        if (this.projectIndex !== undefined && this.projectYear !== undefined) {
            this.app.url.setState(this.viewName, `${this.projectYear}.${this.projectIndex}`);
        } else {
            this.app.url.setState(this.viewName);
        }
    }

    public async setup(): Promise<void> {
        super.setup();

        if (this.loadingPromise) {
            await this.loadingPromise;
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

    private async getCard(year: string, index: number): Promise<ICard> {
        const resource = SiteResources.loadJSON(SiteConfig.path.content + year + ".json");
        const promise = new Promise<IInfoJSON>(res =>
            resource.onLoad(e => res(e.data as IInfoJSON))
        );

        return (await promise).data[index] as ICard;
    }
}

ViewMap.add(ProjectInfoView);

export default ProjectInfoView;