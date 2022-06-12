import css from "./Info.less";

import View from "../../../../core/view/View";
import IApp from "../../../../core/types/app/IApp";
import AppState from "../../../../core/types/AppState";
import ContentMan from "../../../../components/contentMan/contentMan";
import IProjectInfoView from "./IProjectInfo";
import ProjectInfoV2 from "./InfoV2";
import triggerTransitionIn from "../../../../core/utils/triggerTransitionIn";
import SaveScroll from "../../../../components/viewPrivateData/saveScroll/SaveScroll";
import siteResources from "../../../../core/siteResources";
import { V2Project } from "../../../../types/project/v2/V2Types";

/**
 * @viewmetadata
 * @description Info about a project.
 * @tags info,project,about
 */

class ProjectInfoView extends View implements IProjectInfoView {
    public cssName = css.ProjectInfo;
    public isFullPage: boolean = true;

    protected elm: HTMLDivElement;

    private static readonly transitionInTime = 150;

    private project?: V2Project;
    private loadingPromise?: Promise<void>;
    private widget?: ProjectInfoV2;

    private projectYear?: number;
    private projectIndex?: number;
    private saveScroll?: SaveScroll;

    constructor(app: IApp, state: AppState) {
        super(app, state);
        this.elm = document.createElement("div");

        if (state.stateData) {
            this.loadingPromise = this.loadProjectFromStateData(state.stateData);
        }
    }

    public setProject(project: V2Project, year: number, index: number): void {
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

    public getTitle(): string | undefined {
        if (this.widget) {
            return this.widget.getTitle();
        }
    }

    public canScroll(): boolean {
        if (this.widget) {
            return this.widget.canScroll();
        }
        return false;
    }

    public transitionFadeIn(): Promise<void> {
        return triggerTransitionIn(css, this.elm, ProjectInfoView.transitionInTime);
    }

    public async setup(): Promise<void> {
        if (this.loadingPromise) {
            await this.loadingPromise;
        }

        if (!this.project) {
            throw new Error("Project not set");
        }

        this.widget = new ProjectInfoV2(this.app, this.project);

        this.viewComponents.push(
            this.saveScroll = new SaveScroll(this.widget, this.privateData)
        );

        super.setup();
        this.updateState();

        this.widget.setup();
        this.widget.appendTo(this.elm);

        this.saveScroll.apply();

        siteResources.nextDone()
            .then(e => this.saveScroll!.applyScrollDownWithTransition());
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

    private async getCard(year: string, index: number): Promise<V2Project> {
        const card = await ContentMan.getCardByYearAndIndex(year, index);
        return card;
    }
}

export default ProjectInfoView;