import css from "./latestProjects.less";

import IApp from "../../../core/types/app/IApp";
import IWithLocation from "../../../components/contentMan/IWithLocation";
import { V2Project } from "../../../types/project/v2/V2Types";
import ProjectCard from "../ProjectCard/ProjectCard";

class LatestProjectCard {
    private elm: HTMLDivElement;

    private app: IApp;
    private projectCard: ProjectCard;

    constructor(app: IApp, projectWithLocation: IWithLocation<V2Project>) {
        this.app = app;

        this.elm = this.createElm();
        this.projectCard = new ProjectCard(app, projectWithLocation);
    }

    public setup(): void {
        this.projectCard.setup();
        this.projectCard.projectCard.load();
        this.projectCard.appendTo(this.elm);
    }

    public destroy(): void {
        this.projectCard.destory();
    }

    public setAsLatest(): void {
        this.elm.classList.add(css.latest);
    }

    public appendTo(parent: HTMLElement) {
        parent.appendChild(this.elm);
    }

    private createElm(): HTMLDivElement {
        const elm = document.createElement("div");
        elm.classList.add(css.latestProjectCard);
        return elm;
    }
}

export default LatestProjectCard;