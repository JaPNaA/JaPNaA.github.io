import ICard from "../../../types/project/card";
import ProjectCard from "./projectCard";

class ProjectCardFactory {
    public static create(card: ICard): ProjectCard {
        return new ProjectCard(card);
    }
}

export default ProjectCardFactory;