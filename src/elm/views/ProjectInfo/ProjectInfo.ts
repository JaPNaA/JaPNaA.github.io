import "../../../../styles/views/projectInfo.less";

import View from "../../../core/view/view";
import ICard from "../../../types/project/card";
import CardJSONv1Elm from "../../../components/jsonToElm/v1/card";
import ViewMap from "../../../core/view/viewMap";
import SiteConfig from "../../../siteConfig";
import IApp from "../../../core/types/app/iApp";
import SiteResources from "../../../core/siteResources";
import IInfoJSON from "../../../types/project/infojson";
import AppState from "../../../core/types/appState";
import openFrameView from "../../../utils/openFrameView";

class ProjectInfoView extends View {
    public static viewName = "ProjectInfo";
    public viewName = ProjectInfoView.viewName;
    public isFullPage: boolean = true;

    protected elm: HTMLDivElement;

    private project?: ICard;
    private loadingPromise?: Promise<void>;
    private cardElm?: CardJSONv1Elm;

    private projectYear?: number;
    private projectIndex?: number;

    constructor(app: IApp, state: AppState) {
        super(app);
        this.elm = document.createElement("div");

        if (state.stateData) {
            this.loadingPromise = this.loadProjectFromStateData(state.stateData);
        }
    }

    public setProject(project: ICard, year: number, index: number): void {
        this.project = project;
        this.projectYear = year;
        this.projectIndex = index;
    }

    public getState(): string | undefined {
        if (this.projectIndex !== undefined && this.projectYear !== undefined) {
            return `${this.projectYear}.${this.projectIndex}`;
        } else {
            return;
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
        this.cardElm = new CardJSONv1Elm(this.app, this.project);
        this.cardElm.setup();
        this.cardElm.appendTo(this.elm);
        this.cardElm.animateTransitionIn();
        this.cardElm.addEventListeners();

        this.attachLinkClickHandler(this.cardElm.viewProjectButton);
    }

    public async destory(): Promise<void> {
        await super.destory();
        if (this.cardElm) {
            this.cardElm.destory();
        }
    }

    private async loadProjectFromStateData(stateData: string): Promise<void> {
        const [year, index] = stateData.split(".");
        const yearInt: number = parseInt(year);
        const indexInt: number = parseInt(index);

        if (yearInt === undefined || indexInt === undefined) {
            throw new Error("Invalid stateData format");
        }

        this.setProject(await this.getCard(year, indexInt), yearInt, indexInt);

        this.loadingPromise = undefined;
    }

    private async getCard(year: string, index: number): Promise<ICard> {
        const resource = SiteResources.loadJSON(SiteConfig.path.content + year + ".json");
        const promise = new Promise<IInfoJSON>(res =>
            resource.onLoad(e => res(e.data as IInfoJSON))
        );

        return (await promise).data[index] as ICard;
    }

    private attachLinkClickHandler(elm: HTMLAnchorElement) {
        elm.addEventListener("click", this.linkClickHandler.bind(this, elm));
    }

    private linkClickHandler(elm: HTMLAnchorElement, event: MouseEvent) {
        const link = elm.href;
        const topApp = this.app.top();
        openFrameView(topApp, link);

        event.preventDefault();
    }
}

ViewMap.add(ProjectInfoView);

export default ProjectInfoView;