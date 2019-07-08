import IV1Project from "../../types/project/v1/IV1Project";
import { V2Project } from "../../types/project/v2/V2Types";

type V1Or2Project = IV1Project | V2Project;
export default V1Or2Project;