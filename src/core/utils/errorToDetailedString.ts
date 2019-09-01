import CustomError from "../types/CustomError";

export default function errorToDetailedString(err: any): string {
    if (err instanceof Error) {
        return err.stack || (err.name + ": " + err.message);
    } else if (err instanceof CustomError) {
        return err.stack;
    } else {
        return err.toString();
    }
}