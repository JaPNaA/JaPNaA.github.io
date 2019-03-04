import "../../styles/views/projectDetailed.less";

import View from "./view";
import ICard from "../interfaces/project/card";

class ProjectDetailedView extends View {
    public sceneName = "ProjectDetailed";

    protected elm: HTMLDivElement;

    private project: ICard;

    constructor(project: ICard) {
        super();
        this.elm = document.createElement("div");
        this.project = project;
    }

    public setup(): void {
        super.setup();

        const background = document.createElement("div");
        background.classList.add("background");
        background.style.backgroundImage = "url(http://localhost:8081" + this.project.content.display[0].src + ")";
        this.elm.appendChild(background);
    }
}

export default ProjectDetailedView;