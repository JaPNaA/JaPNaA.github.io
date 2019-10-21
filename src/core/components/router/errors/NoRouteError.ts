import CustomError from "../../../types/CustomError";

class NoRouteError extends CustomError {
    constructor(message: string) {
        super("No route exists: " + message);
    }
}

export default NoRouteError;