import "../../../../styles/views/ProjectInfo.less";

import View from "../../../core/view/View";
import IV1Card from "../../../types/project/v1/IV1Card";
import CardJSONv1Elm from "../../../components/jsonToElm/v1/card";
import ViewMap from "../../../core/view/ViewMap";
import siteConfig from "../../../SiteConfig";
import IApp from "../../../core/types/app/IApp";
import siteResources from "../../../core/siteResources";
import IV1InfoJSON from "../../../types/project/v1/IV1InfoJSON";
import AppState from "../../../core/types/AppState";
import openFrameView from "../../../utils/openFrameView";
import ContentMan from "../../../components/contentMan/contentMan";
import isV2Project from "../../../utils/isV2Project";
import V1Or2Card from "../../../components/contentMan/V1Or2Card";
import V1Or2Project from "../../../components/contentMan/V1Or2Project";
import ProjectJSONv2Elm from "../../../components/jsonToElm/v2/project";
import Widget from "../../../core/widget/Widget";

class ProjectInfoView extends View {
    public static viewName = "ProjectInfo";
    public viewName = ProjectInfoView.viewName;
    public isFullPage: boolean = true;

    protected elm: HTMLDivElement;

    private project?: V1Or2Card;
    private loadingPromise?: Promise<void>;
    private cardElm?: Widget;

    private projectYear?: number;
    private projectIndex?: number;

    constructor(app: IApp, state: AppState) {
        super(app);
        this.elm = document.createElement("div");

        if (state.stateData) {
            this.loadingPromise = this.loadProjectFromStateData(state.stateData);
        }
    }

    public setProject(project: V1Or2Card, year: number, index: number): void {
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

        if (isV2Project(this.project)) {
            const project = new ProjectJSONv2Elm(this.project);
            project.setup();
            project.appendTo(this.elm);
            this.cardElm = project;
        } else {
            // FOR VERSION 1 CARD
            const card = new CardJSONv1Elm(this.app, this.project);
            card.setup();
            card.appendTo(this.elm);
            card.animateTransitionIn();
            card.addEventListeners();
            this.attachLinkClickHandler(card.viewProjectButton);

            this.cardElm = card;
        }

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

        this.setProject(await this.getCard(year, indexInt) as V1Or2Card, yearInt, indexInt);

        this.loadingPromise = undefined;
    }

    private async getCard(year: string, index: number): Promise<V1Or2Project> {
        return ContentMan.getCardByYearAndIndex(year, index);
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