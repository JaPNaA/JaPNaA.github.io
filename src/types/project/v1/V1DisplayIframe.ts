import V1Display from "./V1Display";

interface V1DisplayIframe {
    /** Type of item */
    type: "iframe";
    /** Link to iframe */
    src: string;
    /** Alternate */
    alt: V1Display;
}

export default V1DisplayIframe;