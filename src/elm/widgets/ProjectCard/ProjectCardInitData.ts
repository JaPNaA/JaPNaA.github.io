import IWithLocation from "../../../components/contentMan/IWithLocation";
import V1Or2Card from "../../../components/contentMan/V1Or2Card";
import ProjectLink from "./ProjectLink";

type ProjectCardInitData = IWithLocation<V1Or2Card> | ProjectLink;
export default ProjectCardInitData;