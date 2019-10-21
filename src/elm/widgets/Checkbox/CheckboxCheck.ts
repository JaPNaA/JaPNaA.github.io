import css from "./checkbox.less";

import EventHandlers from "../../../core/utils/events/EventHandlers";
import Handler from "../../../core/utils/events/Handler";
import Widget from "../../../core/widget/Widget";

class CheckboxCheck extends Widget {
    public cssName = "checkbox";
    protected elm: Element;

    private checkElm: HTMLDivElement;
    private input: HTMLInputElement;

    private changedHandlers: EventHandlers<boolean>;

    private checked: boolean;

    constructor() {
        super();

        this.elm = document.createElement("div");
        this.checkElm = this.createCheck();
        this.input = this.createInput();

        this.changedHandlers = new EventHandlers();

        this.checked = false;
    }

    public setup(): void {
        super.setup();
        this.elm.appendChild(this.input);
        this.elm.appendChild(this.checkElm);

        this.elm.addEventListener("click", this.clickHandler.bind(this));
        this.input.addEventListener("change", this.inputChangeHandler.bind(this));
        this.input.addEventListener("focus", this.focusHandler.bind(this));
        this.input.addEventListener("blur", this.blurHandler.bind(this));
    }

    public isChecked(): boolean {
        return this.checked;
    }

    public setChecked(val: boolean): void {
        if (this.checked === val) { return; }
        this.checked = val;
        this.updateState();
        this.changedHandlers.dispatch(val);
    }

    public setLabel(label: string): void {
        this.input.title = label;
    }

    public toggleChecked(): void {
        this.checked = !this.checked;
        this.updateState();
        this.changedHandlers.dispatch(this.checked);
    }

    public onChange(handler: Handler<boolean>) {
        this.changedHandlers.add(handler);
    }

    public offChange(handler: Handler<boolean>) {
        this.changedHandlers.remove(handler);
    }

    private createInput(): HTMLInputElement {
        const input = document.createElement("input");
        input.type = "checkbox";
        input.classList.add(css.hiddenCheckbox);
        return input;
    }

    private createCheck(): HTMLDivElement {
        const check = document.createElement("div");
        check.classList.add(css.check);
        return check;
    }

    private clickHandler(): void {
        this.toggleChecked();
    }

    private inputChangeHandler(): void {
        this.setChecked(this.input.checked);
    }

    private focusHandler(): void {
        this.elm.classList.add(css.focused);
    }

    private blurHandler(): void {
        this.elm.classList.remove(css.focused);
    }

    private updateState(): void {
        if (this.checked) {
            this.elm.classList.add(css.checked);
        } else {
            this.elm.classList.remove(css.checked);
        }

        this.input.checked = this.checked;
    }
}

export default CheckboxCheck;