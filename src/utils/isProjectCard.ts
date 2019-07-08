import IV1Project from "../types/project/v1/IV1Project";
import IV1Card from "../types/project/v1/IV1Card";

export default function isProjectCard(proj: IV1Project): proj is IV1Card {
    return proj && proj.type === "card";
}