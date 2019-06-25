import IApp from "../../../core/types/app/IApp";
import ProjectV1CardCard from "./projectCard/ProjectV1CardCard";
import ProjectLinkCard from "./projectCard/ProjectLinkCard";
import ICardWithLocation from "../../../components/contentMan/ICardWithLocation";

class ProjectCardFactory {
    public static createV1(app: IApp, card: ICardWithLocation): ProjectV1CardCard {
        return new ProjectV1CardCard(app, card.project, card.year, card.index);
    }

    public static createLink(app: IApp, name: string, href: string): ProjectLinkCard {
        return new ProjectLinkCard(app, name, href);
    }
}

export default ProjectCardFactory;