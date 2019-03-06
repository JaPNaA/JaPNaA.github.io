import "../../styles/views/projectDetailed.less";

import View from "./view";
import ICard from "../interfaces/project/card";
import CardJSONv1Elm from "../components/jsonToElm/cardV1";
import App from "../app";

class ProjectDetailedView extends View {
    public viewName = "ProjectDetailed";

    protected elm: HTMLDivElement;

    private project: ICard;

    constructor(app: App, project: ICard) {
        super(app);
        this.elm = document.createElement("div");
        this.project = project;
    }

    public setup(): void {
        super.setup();

        // FOR VERSION 1
        const elm = new CardJSONv1Elm(this.project);
        elm.appendTo(this.elm);
        elm.animateTransitionIn();
        elm.addEventListeners();
    }

}

export default ProjectDetailedView;