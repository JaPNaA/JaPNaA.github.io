interface AppState {
    /** The path to get to the view */
    viewPath: string;
    /** Title of view */
    viewTitle?: string;
    /** Id of the view */
    id?: number;
    /** The url used to access view */
    directURL?: string;
    /** The public state of the view (in url) */
    stateData?: string;

    /**
     * Private data about view, for the view to use any way the view likes
     * 
     * JSON.stringify-able (no functions, no circular structures, etc.)
     */
    privateData?: any;
};

export default AppState;