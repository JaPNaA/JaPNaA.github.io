import Display from "./display";

interface ICardContent {
    /** Link to item showcased */
    link: string,
    /** Description of card, goes under the name */
    description: string,
    /** Images and stuff */
    display: Display[];
};

export default ICardContent;