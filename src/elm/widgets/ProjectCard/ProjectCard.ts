import Widget from "../../../core/widget/Widget";
import WidgetMap from "../../../core/widget/WidgetMap";
import IWithLocation from "../../../components/contentMan/IWithLocation";
import V1Or2Card from "../../../components/contentMan/V1Or2Card";
import ProjectLink from "./ProjectLink";
import isWithLocation from "../../../utils/isProjectCardWithLocation";
import BaseProjectCard from "./BaseProjectCard";
import ProjectCardFactory from "./ProjectCardFactory";
import IApp from "../../../core/types/app/IApp";

/**
 * ProjectCardFactory, but as a Widget
 */
class ProjectCard extends Widget {
    public static widgetName = "projectCard";
    public widgetName = ProjectCard.widgetName;

    protected elm: HTMLDivElement;

    private app: IApp;
    private projectCard: BaseProjectCard;

    constructor(app: IApp, card: IWithLocation<V1Or2Card> | ProjectLink) {
        super();

        this.app = app;
        this.elm = document.createElement("div");

        if (isWithLocation(card)) {
            this.projectCard = ProjectCardFactory.createCard(app, card)
        } else {
            this.projectCard = ProjectCardFactory.createLink(app, card.name, card.href);
        }
    }

    public setup() {
        super.setup();
        this.projectCard.appendTo(this.elm);
    }
}

WidgetMap.add(ProjectCard);

export default ProjectCard;