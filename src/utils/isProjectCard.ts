import IProject from "../types/project/v1/IProject";
import ICard from "../types/project/v1/ICard";

export default function isProjectCard(proj: IProject): proj is ICard {
    return proj && proj.type === "card";
}