import IApp from "../../../core/types/app/IApp";
import IWithLocation from "../../../components/contentMan/IWithLocation";
import ProjectCardCard from "./subtypes/ProjectCardCard";
import ProjectLinkCard from "./subtypes/ProjectLinkCard";
import ProjectV2ProjectCard from "./subtypes/ProjectV2ProjectCard";
import { V2Project } from "../../../types/project/v2/V2Types";

class ProjectCardFactory {
    public static createCard(app: IApp, card: IWithLocation<V2Project>): ProjectCardCard<V2Project> {
        return new ProjectV2ProjectCard(app, card.project, card.year, card.index);
    }

    public static createLink(app: IApp, name: string, href: string): ProjectLinkCard {
        return new ProjectLinkCard(app, name, href);
    }
}

export default ProjectCardFactory;