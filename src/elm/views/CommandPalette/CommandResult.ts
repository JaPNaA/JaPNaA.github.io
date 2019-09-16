import IApp from "../../../core/types/app/IApp";

abstract class CommandResult {
    public label: string;
    public clickable = true;

    public elm?: HTMLElement;

    constructor(label: string) {
        this.label = label;
    }

    public abstract activate(app: IApp): void;
}

export default CommandResult;