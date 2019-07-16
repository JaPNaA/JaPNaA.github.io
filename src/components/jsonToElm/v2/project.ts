import Widget from "../../../core/widget/Widget";
import { V2Project } from "../../../types/project/v2/V2Types";

class ProjectJSONv2Elm extends Widget {
    protected elm: HTMLDivElement;
    
    private project: V2Project;

    constructor(project: V2Project) {
        super();
        this.elm = document.createElement("div");
        this.project = project;
    }

    public setup(): void {
        super.setup();
        this.elm.innerHTML = JSON.stringify(this.project);
    }
}

export default ProjectJSONv2Elm;