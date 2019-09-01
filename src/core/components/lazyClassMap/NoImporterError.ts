import CustomError from "../../types/CustomError";

export default class NoImporterError extends CustomError {
    constructor() {
        super("Tried to import class without importer function");
    }
}