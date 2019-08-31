import Widget from "../../../core/widget/Widget";
import IApp from "../../../core/types/app/IApp";
import { V2Project } from "../../../types/project/v2/V2Types";
import ProjectJSONv2Elm from "../../../components/jsonToElm/v2/ProjectJSONv2Elm";

class ProjectInfoV2 extends Widget {
    public static widgetName = "projectInfoV2";
    public widgetName = ProjectInfoV2.widgetName;

    protected elm: HTMLDivElement;

    private projectElm: ProjectJSONv2Elm;

    constructor(app: IApp, project: V2Project) {
        super();
        this.elm = document.createElement("div");
        this.projectElm = new ProjectJSONv2Elm(app, project);
    }

    public canScroll(): boolean {
        return this.projectElm.canScroll();
    }

    public setup(): void {
        super.setup();

        this.projectElm.setup();
        this.projectElm.appendTo(this.elm);
    }

    public destory(): void {
        super.destory();
        this.projectElm.destory();
    }
}

export default ProjectInfoV2;