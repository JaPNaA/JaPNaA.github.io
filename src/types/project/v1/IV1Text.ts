import IV1Project from "./IV1Project";

interface IV1Text extends IV1Project {
    type: "text";
    /** Title of text */
    title: string;
    /** Body of text in HTML */
    content: string;
}

export default IV1Text;