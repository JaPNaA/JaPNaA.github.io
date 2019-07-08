import IV1Project from "./IV1Project";
import IV1CardContent from "./IV1CardContent";

interface IV1Card extends IV1Project {
    type: "card";
    /** Content of card */
    content: IV1CardContent,
    /** Tags of project, can be searched for */
    tags: string[];
    /** Name of project */
    name: string;
    /** List of authors */
    author: string[];
    /** Project number, can be used as shortlink */
    no: number;
}

export default IV1Card;