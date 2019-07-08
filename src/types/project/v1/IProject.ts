interface IProject {
    /** Type of item */
    type: "card" | "text";
    // content

    /** When the item was created */
    timestamp?: number;
    /** Inline CSS */
    style?: string;
    /** Replace ${{js}} with evaluated result */
    jsformat?: boolean;
}

export default IProject;