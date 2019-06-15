import ICard from "../../../types/project/card";
import ProjectCard from "./projectCard";
import IApp from "../../../core/types/app/iApp";

class ProjectCardFactory {
    public static create(app: IApp, card: ICard): ProjectCard {
        return new ProjectCard(app, card);
    }
}

export default ProjectCardFactory;