import IApp from "../../../core/types/app/IApp";

abstract class CommandResult {
    public label: string;
    public clickable = true;

    constructor(label: string) {
        this.label = label;
    }

    public abstract activate(app: IApp): void;
}

export default CommandResult;