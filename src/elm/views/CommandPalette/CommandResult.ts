import IApp from "../../../core/types/app/IApp";

abstract class CommandResult {
    public label: string;
    public description?: string;
    public clickable = true;

    public elm?: HTMLElement;

    constructor(label: string, description?: string) {
        this.label = label;
        this.description = description;
    }

    public abstract activate(app: IApp): void;
}

export default CommandResult;