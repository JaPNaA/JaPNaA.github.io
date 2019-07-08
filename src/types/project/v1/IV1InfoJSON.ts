import IV1Project from "./IV1Project";

interface IV1InfoJSON {
    /** Where all the main data is stored */
    data: IV1Project[];
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

export default IV1InfoJSON;