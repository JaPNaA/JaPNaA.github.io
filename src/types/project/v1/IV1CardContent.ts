import DisplayV1 from "./V1Display";

interface IV1CardContent {
    /** Link to item showcased */
    link: string,
    /** Description of card, goes under the name */
    description: string,
    /** Images and stuff */
    display: DisplayV1[];
};

export default IV1CardContent;