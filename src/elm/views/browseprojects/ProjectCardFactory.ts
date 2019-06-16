import ICard from "../../../types/project/card";
import IApp from "../../../core/types/app/iApp";
import ProjectV1CardCard from "./projectCard/ProjectV1CardCard";
import ProjectLinkCard from "./projectCard/ProjectLinkCard";

class ProjectCardFactory {
    // TODO: Refactor method: too many arguments
    public static createV1(app: IApp, card: ICard, year: number, index: number): ProjectV1CardCard {
        return new ProjectV1CardCard(app, card, year, index);
    }

    public static createLink(app: IApp, name: string, href: string): ProjectLinkCard {
        return new ProjectLinkCard(app, name, href);
    }
}

export default ProjectCardFactory;