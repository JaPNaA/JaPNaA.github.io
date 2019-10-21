import NoRouteError from "./NoRouteError";

class NoWidgetError extends NoRouteError {
    constructor(route: string) {
        super("where is widget: " + route);
    }
}

export default NoWidgetError;