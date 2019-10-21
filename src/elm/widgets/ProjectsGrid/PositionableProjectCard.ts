import css from "./projectsGrid.less";

import IPositionable from "../../../components/dynamicGrid/types/IPositionable";
import IApp from "../../../core/types/app/IApp";
import ProjectCardInitData from "../ProjectCard/ProjectCardInitData";
import ProjectCard from "../ProjectCard/ProjectCard";
import { Rect, newRect } from "../../../types/math/Rect";
import isVisible from "../../../utils/isVisible";
import BaseProjectCard from "../ProjectCard/BaseProjectCard";

class PositionableProjectCard implements IPositionable {
    public projectCard: BaseProjectCard;

    private app: IApp;
    private elm: HTMLDivElement;
    private projectCardWidget: ProjectCard;

    constructor(app: IApp, init: ProjectCardInitData) {
        this.app = app;
        
        this.elm = document.createElement("div");
        this.elm.classList.add(css.positionableProjectCard);

        this.projectCardWidget = new ProjectCard(app, init);
        this.projectCard = this.projectCardWidget.projectCard;
    }

    public setup() {
        this.projectCardWidget.setup();
        this.projectCardWidget.appendTo(this.elm);
    }

    public appendTo(parent: HTMLDivElement) {
        parent.appendChild(this.elm);
    }

    public setRect(rect: Rect): void {
        this.elm.style.top = rect.y + "px";
        this.elm.style.left = rect.x + "%";
        this.elm.style.width = rect.width + "%";
        this.elm.style.height = rect.height + "px";
    }

    public getClientRect(): Rect {
        const bbox = this.elm.getBoundingClientRect();
        return newRect(bbox.left, bbox.top, bbox.width, bbox.height);
    }

    public isVisible(viewport?: Rect): boolean {
        return isVisible(this.elm, viewport);
    }
}

export default PositionableProjectCard;