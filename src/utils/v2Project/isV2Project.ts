import { V2Project } from "../../types/project/v2/V2Types";
import IV1Project from "../../types/project/v1/IV1Project";

export default function isV2Project(x: V2Project | IV1Project): x is V2Project {
    // @ts-ignore
    return x && typeof x.head === "object" && x.body;
}