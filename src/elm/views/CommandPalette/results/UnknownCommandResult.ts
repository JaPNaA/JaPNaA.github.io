import CommandResult from "../CommandResult";

class UnknownCommandResult extends CommandResult {
    public clickable = false;

    constructor() {
        super("Unknown Command");
    }

    public activate() { }
}

export default UnknownCommandResult;