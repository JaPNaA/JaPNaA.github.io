import CommandResult from "../CommandResult";

class InfoCommandResult extends CommandResult {
    public clickable = false;

    constructor(info: string, desciption?: string) {
        super(info, desciption);
    }

    public activate() { }

    public onTab(): string {
        return this.label;
    }
}

export default InfoCommandResult;