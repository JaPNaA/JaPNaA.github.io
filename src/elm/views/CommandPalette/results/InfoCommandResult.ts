import CommandResult from "../CommandResult";

class InfoCommandResult extends CommandResult {
    public clickable = false;

    constructor(info: string) {
        super(info);
    }

    activate() { }
}

export default InfoCommandResult;