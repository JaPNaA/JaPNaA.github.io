import IApp from "../../../core/types/app/IApp";
import IWithLocation from "../../../components/contentMan/IWithLocation";
import { V2Project } from "../../../types/project/v2/V2Types";
import applyV2ProjectBackground from "../../../utils/v2Project/applyV2ProjectBackground";
import heroViewOpenTransition from "../../../utils/heroViewOpenTransition";
import IProjectInfoView from "../../views/ProjectInfo/IProjectInfo";

class LatestProjectCard {
    private elm: HTMLDivElement;
    private nameElm: HTMLDivElement;

    private app: IApp;
    private project: IWithLocation<V2Project>;

    private clicked: boolean;

    constructor(app: IApp, projectWithLocation: IWithLocation<V2Project>) {
        this.app = app;
        this.project = projectWithLocation;

        this.elm = document.createElement("div");
        this.elm.classList.add("latestProjectCard");

        this.nameElm = this.createNameElm();

        this.clicked = false;
    }

    public setup(): void {
        this.elm.appendChild(this.nameElm);

        this.applyBackground();

        this.addEventHandlers();
    }

    public appendTo(parent: HTMLElement) {
        parent.appendChild(this.elm);
    }

    private createNameElm(): HTMLDivElement {
        const nameElm = document.createElement("div");
        nameElm.classList.add("name");
        nameElm.innerText = this.project.project.head.name;
        return nameElm;
    }

    private applyBackground() {
        applyV2ProjectBackground(this.project.project, this.elm);
    }

    private addEventHandlers(): void {
        this.elm.addEventListener("click", this.clickHandler.bind(this));
    }

    private clickHandler(): void {
        if (this.clicked) { return; }
        this.clicked = true;

        heroViewOpenTransition<IProjectInfoView>(
            this.app,
            this.elm,
            "ProjectInfo",
            this.project.year + "." + this.project.index,
            view => view.transitionFadeIn()
        );
    }
}

export default LatestProjectCard;