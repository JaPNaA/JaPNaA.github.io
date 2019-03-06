import "../../styles/views/projectDetailed.less";

import View from "./_view";
import ICard from "../interfaces/project/card";
import CardJSONv1Elm from "../components/jsonToElm/cardV1";
import App from "../app";
import ViewMap from "./_list";

class ProjectDetailedView extends View {
    public static viewName = "ProjectDetailed";
    public viewName = ProjectDetailedView.viewName;

    protected elm: HTMLDivElement;
    protected isFullPage: boolean = true;

    private project?: ICard;

    constructor(app: App) {
        super(app);
        this.elm = document.createElement("div");
    }

    public setProject(project: ICard): void {
        this.project = project;
    }

    public setup(): void {
        super.setup();

        if (!this.project) { throw new Error("Project not set"); }

        // FOR VERSION 1
        const elm = new CardJSONv1Elm(this.project);
        elm.appendTo(this.elm);
        elm.animateTransitionIn();
        elm.addEventListeners();
    }
}

ViewMap.add(ProjectDetailedView);

export default ProjectDetailedView;