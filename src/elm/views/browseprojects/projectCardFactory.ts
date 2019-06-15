import ICard from "../../../types/project/card";
import ProjectCard from "./projectCard";
import IApp from "../../../core/types/app/iApp";

class ProjectCardFactory {
    // TODO: Refactor method: too many arguments
    public static create(app: IApp, card: ICard, year: number, index: number): ProjectCard {
        return new ProjectCard(app, card, year, index);
    }
}

export default ProjectCardFactory;