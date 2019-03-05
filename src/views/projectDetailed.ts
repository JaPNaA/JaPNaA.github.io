import "../../styles/views/projectDetailed.less";

import View from "./view";
import ICard from "../interfaces/project/card";
import CardJSONv1Elm from "../components/jsonToElm/cardV1";

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
        const elm = new CardJSONv1Elm(this.project);
        elm.appendTo(this.elm);
        elm.animateTransitionIn();
    }

}

export default ProjectDetailedView;