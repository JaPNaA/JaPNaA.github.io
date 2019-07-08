import IV1Card from "../../types/project/v1/IV1Card";
import { V2Project } from "../../types/project/v2/V2Types";

type V1Or2Card = IV1Card | V2Project;
export default V1Or2Card;