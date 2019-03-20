import IProject from "./project";

interface IText extends IProject {
    type: "text";
    /** Title of text */
    title: string;
    /** Body of text in HTML */
    content: string;
}

export default IText;