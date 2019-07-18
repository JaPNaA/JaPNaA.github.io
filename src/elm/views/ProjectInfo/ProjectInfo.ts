import "../../../../styles/views/ProjectInfo.less";

import View from "../../../core/view/View";
import ViewMap from "../../../core/view/ViewMap";
import IApp from "../../../core/types/app/IApp";
import AppState from "../../../core/types/AppState";
import ContentMan from "../../../components/contentMan/contentMan";
import IProjectInfoView from "./IProjectInfo";
import isProjectV1Card from "../../../utils/isProjectCard";
import V1Or2Project from "../../../components/contentMan/V1Or2Project";
import ProjectInfoV1 from "./ProjectInfoV1";
import isV2Project from "../../../utils/isV2Project";
import ProjectInfoV2 from "./ProjectInfoV2";
import Widget from "../../../core/widget/Widget";

class ProjectInfoView extends View implements IProjectInfoView {
    public static viewName = "ProjectInfo";
    public viewName = ProjectInfoView.viewName;
    public isFullPage: boolean = true;

    protected elm: HTMLDivElement;

    private project?: V1Or2Project;
    private loadingPromise?: Promise<void>;
    private widget?: Widget;

    private projectYear?: number;
    private projectIndex?: number;

    constructor(app: IApp, state: AppState) {
        super(app);
        this.elm = document.createElement("div");

        if (state.stateData) {
            this.loadingPromise = this.loadProjectFromStateData(state.stateData);
        }
    }

    public setProject(project: V1Or2Project, year: number, index: number): void {
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

    public canScroll(): boolean {
        if (this.widget) {
            return this.widget.canScroll();
        }
        return false;
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

        if (isProjectV1Card(this.project)) {
            this.widget = new ProjectInfoV1(this.app, this.project);
        } else if (isV2Project(this.project)) {
            this.widget = new ProjectInfoV2(this.app, this.project);
        } else {
            throw new Error("Unsupported type");
        }

        this.widget.setup();
        this.widget.appendTo(this.elm);
    }

    public async destory(): Promise<void> {
        await super.destory();
        if (this.widget) {
            this.widget.destory();
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

    private async getCard(year: string, index: number): Promise<V1Or2Project> {
        const card = await ContentMan.getCardByYearAndIndex(year, index);
        return card;
    }
}

ViewMap.add(ProjectInfoView);

export default ProjectInfoView;