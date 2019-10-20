import CustomError from "../../types/CustomError";

class NoRouteError extends CustomError {
    constructor(route: string) {
        super("No route exists: " + route);
    }
}

export default NoRouteError;