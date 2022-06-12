import IWithLocation from "../../../components/contentMan/IWithLocation";
import { V2Project } from "../../../types/project/v2/V2Types";
import ProjectLink from "./ProjectLink";

type ProjectCardInitData = IWithLocation<V2Project> | ProjectLink;
export default ProjectCardInitData;
