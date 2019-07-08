import V1Or2Project from "../components/contentMan/V1Or2Project";
import IV1Card from "../types/project/v1/IV1Card";

export default function isProjectV1Card(proj: V1Or2Project): proj is IV1Card {
    // @ts-ignore
    return proj && proj.type === "card";
}