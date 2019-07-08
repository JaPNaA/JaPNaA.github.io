interface V1DisplayImg {
    /** Type of item */
    type: "img";
    /** Title of image, shown on hover, and when image doesn't load */
    caption?: string;
    /** Link to image */
    src?: string;
};

export default V1DisplayImg;