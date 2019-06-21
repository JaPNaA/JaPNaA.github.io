import "../../../../styles/views/browseProjects.less";

import View from "../../../core/view/view";
import ViewMap from "../../../core/view/viewMap";
import IApp from "../../../core/types/app/iApp";
import ProjectsGrid from "../../widgets/projectsgrid/projectsgrid";

class BrowseProjects extends View {
    public static viewName = "BrowseProjects";
    public isFullPage = true;
    public viewName = BrowseProjects.viewName;

    protected elm: HTMLDivElement;
    private projectsGrid: ProjectsGrid;

    constructor(app: IApp) {
        super(app);
        this.elm = document.createElement("div");
        this.projectsGrid = new ProjectsGrid(this.app);
    }

    public async setup(): Promise<void> {
        await super.setup();
        this.projectsGrid.setup();
        this.projectsGrid.appendTo(this.elm);
        this.addEventHandlers();
    }

    public async destory(): Promise<void> {
        await super.destory();
        this.projectsGrid.destory();
    }

    private addEventHandlers(): void {
        this.events.onResize(this.updateWidgetSize.bind(this));
        this.updateWidgetSize();
    }

    private updateWidgetSize(): void {
        this.projectsGrid.resize(this.app.width, this.app.height);
    }
}

ViewMap.add(BrowseProjects);

export default BrowseProjects;