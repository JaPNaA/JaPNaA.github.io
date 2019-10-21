import NoRouteError from "./NoRouteError";

class NoViewError extends NoRouteError {
    constructor(route: string) {
        super("where is view: " + route);
    }
}

export default NoViewError;