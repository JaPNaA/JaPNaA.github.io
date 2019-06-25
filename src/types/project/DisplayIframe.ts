import Display from "./Display";

interface DisplayIframe {
    /** Type of item */
    type: "iframe";
    /** Link to iframe */
    src: string;
    /** Alternate */
    alt: Display;
}

export default DisplayIframe;