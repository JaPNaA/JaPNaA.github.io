import IProject from "./project/project";

interface IInfoJSON {
    /** Where all the main data is stored */
    data: IProject[];
    meta: {
        /** Link to previous data */
        previous: string;
        /** Link to next data */
        after: string;
        /** Index of current file */
        index: number;
        /** Year of listed projects */
        range: number;
    }
}

export default IInfoJSON;