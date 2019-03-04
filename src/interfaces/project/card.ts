import IProject from "./project";
import ICardContent from "./cardContent";

interface ICard extends IProject {
    type: "card";
    /** Content of card */
    content: ICardContent,
    /** Tags of project, can be searched for */
    tags: string[];
    /** Name of project */
    name: string;
    /** List of authors */
    author: string[];
    /** Project number, can be used as shortlink */
    no: number;
}

export default ICard;