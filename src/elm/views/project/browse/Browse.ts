import css from "./Browse.less";

import View from "../../../../core/view/View";
import IApp from "../../../../core/types/app/IApp";
import ProjectsGrid from "../../../widgets/ProjectsGrid/ProjectsGrid";
import AppState from "../../../../core/types/AppState";

/**
 * @viewmetadata
 * @description Scroll though and see all my projects, with pictures (on some of them)!
 * @tags browse,directory,projects,pictures,large
 */

class BrowseProjects extends View {
    public static cssName = css.BrowseProjects;
    public isFullPage = true;
    public cssName = BrowseProjects.cssName;

    protected elm: HTMLDivElement;
    private projectsGrid: ProjectsGrid;

    constructor(app: IApp, state: AppState) {
        super(app, state);
        this.elm = document.createElement("div");
        this.projectsGrid = new ProjectsGrid(this.app);
    }

    public async setup(): Promise<void> {
        super.setup();

        this.updateWidgetSize();
        this.projectsGrid.setup();
        this.projectsGrid.appendTo(this.elm);

        this.addEventHandlers();
    }

    public async destory(): Promise<void> {
        await super.destory();
        this.projectsGrid.destory();
    }

    public canScroll(): boolean {
        return this.projectsGrid.isOverflowing();
    }

    private addEventHandlers(): void {
        this.events.onResize(this.updateWidgetSize.bind(this));
        this.updateWidgetSize();
    }

    private updateWidgetSize(): void {
        this.projectsGrid.resize(this.app.width, this.app.height);
    }
}

export default BrowseProjects;