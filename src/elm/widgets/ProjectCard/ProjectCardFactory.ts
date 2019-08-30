import IApp from "../../../core/types/app/IApp";
import IWithLocation from "../../../components/contentMan/IWithLocation";
import ProjectCardCard from "./subtypes/ProjectCardCard";
import ProjectLinkCard from "./subtypes/ProjectLinkCard";
import ProjectV1CardCard from "./subtypes/ProjectV1CardCard";
import ProjectV2ProjectCard from "./subtypes/ProjectV2ProjectCard";
import V1Or2Card from "../../../components/contentMan/V1Or2Card";
import isV2Project from "../../../utils/v2Project/isV2Project";

class ProjectCardFactory {
    public static createCard(app: IApp, card: IWithLocation<V1Or2Card>): ProjectCardCard<V1Or2Card> {
        if (isV2Project(card.project)) {
            return new ProjectV2ProjectCard(app, card.project, card.year, card.index);
        } else {
            return new ProjectV1CardCard(app, card.project, card.year, card.index);
        }
    }

    public static createLink(app: IApp, name: string, href: string): ProjectLinkCard {
        return new ProjectLinkCard(app, name, href);
    }
}

export default ProjectCardFactory;