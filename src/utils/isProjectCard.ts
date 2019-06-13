import IProject from "../types/project/project";
import ICard from "../types/project/card";

export default function isProjectCard(proj: IProject): proj is ICard {
    return proj && proj.type === "card";
}