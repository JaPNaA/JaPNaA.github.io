import CommandResult from "../CommandResult";

class InfoCommandResult extends CommandResult {
    public clickable = false;

    constructor(info: string, desciption?: string) {
        super(info, desciption);
    }

    activate() { }
}

export default InfoCommandResult;