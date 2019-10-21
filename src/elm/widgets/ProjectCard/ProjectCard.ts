import css from "./projectCard.less";

import Widget from "../../../core/widget/Widget";
import isWithLocation from "../../../utils/isProjectCardWithLocation";
import BaseProjectCard from "./BaseProjectCard";
import ProjectCardFactory from "./ProjectCardFactory";
import IApp from "../../../core/types/app/IApp";
import ProjectCardInitData from "./ProjectCardInitData";

/**
 * ProjectCardFactory, but as a Widget
 */
class ProjectCard extends Widget {
    public cssName = css.projectCardContainer;
    public projectCard: BaseProjectCard;

    protected elm: HTMLDivElement;

    private app: IApp;

    constructor(app: IApp, initData: ProjectCardInitData) {
        super();

        this.app = app;
        this.elm = document.createElement("div");

        if (isWithLocation(initData)) {
            this.projectCard = ProjectCardFactory.createCard(app, initData)
        } else {
            this.projectCard = ProjectCardFactory.createLink(app, initData.name, initData.href);
        }
    }

    public setup() {
        super.setup();
        this.projectCard.setup();
        this.projectCard.appendTo(this.elm);
    }
}

export default ProjectCard;