import IProject from "../types/project/IProject";
import ICard from "../types/project/ICard";

export default function isProjectCard(proj: IProject): proj is ICard {
    return proj && proj.type === "card";
}