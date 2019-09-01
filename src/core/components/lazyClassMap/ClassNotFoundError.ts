import CustomError from "../../types/CustomError";

export default class ClassNotFoundError extends CustomError {
    constructor(className: string) {
        super("Class with name \"" + className + "\" doesn't exist, tried importing");
    }
}