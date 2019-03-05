import "../../styles/views/projectDetailed.less";

import View from "./view";
import ICard from "../interfaces/project/card";
import CardJSONv1ToElm from "../components/jsonToElm/cardV1";

class ProjectDetailedView extends View {
    public viewName = "ProjectDetailed";

    protected elm: HTMLDivElement;

    private project: ICard;

    constructor(project: ICard) {
        super();
        this.elm = document.createElement("div");
        this.project = project;
    }

    public setup(): void {
        super.setup();

        // FOR VERSION 1
        this.elm.appendChild(CardJSONv1ToElm.parse(this.project));
    }

}

export default ProjectDetailedView;