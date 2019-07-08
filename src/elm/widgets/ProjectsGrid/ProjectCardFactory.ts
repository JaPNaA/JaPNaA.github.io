import IApp from "../../../core/types/app/IApp";
import ProjectV1CardCard from "./projectCard/ProjectV1CardCard";
import ProjectLinkCard from "./projectCard/ProjectLinkCard";
import IWithLocation from "../../../components/contentMan/IWithLocation";
import IV1Card from "../../../types/project/v1/IV1Card";
import { V2Project } from "../../../types/project/v2/V2Types";
import ProjectV2ProjectCard from "./projectCard/ProjectV2ProjectCard";

class ProjectCardFactory {
    public static createV1(app: IApp, card: IWithLocation<IV1Card>): ProjectV1CardCard {
        return new ProjectV1CardCard(app, card.project, card.year, card.index);
    }

    public static createV2(app: IApp, card: IWithLocation<V2Project>): ProjectV2ProjectCard {
        return new ProjectV2ProjectCard(app, card.project, card.year, card.index);
    }

    public static createLink(app: IApp, name: string, href: string): ProjectLinkCard {
        return new ProjectLinkCard(app, name, href);
    }
}

export default ProjectCardFactory;