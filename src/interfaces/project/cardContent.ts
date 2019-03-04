interface ICardContent {
    /** Link to item showcased */
    link: string,
    /** Description of card, goes under the name */
    description: string,
    /** Images and stuff */
    display: {
        /** Type of item */
        type: "img";
        /** Title of image, shown on hover, and when image doesn't load */
        caption?: string;
        /** Link to image */
        src?: string;
    }[];
};

export default ICardContent;