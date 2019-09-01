abstract class CustomError implements Error {
    public name: string;
    public message: string;
    public stack: string;

    private internalErrorObj: Error;

    constructor(message?: string) {
        this.internalErrorObj = new Error(message);

        this.name = this.internalErrorObj.name;
        this.message = this.internalErrorObj.message;
        this.stack = this.internalErrorObj.stack || this.message;
    }

    public toString(): string {
        return this.name + ": " + this.message;
    }
}

export default CustomError;