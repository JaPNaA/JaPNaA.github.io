import css from "./checkbox.less";

import Widget from "../../../core/widget/Widget";
import CheckboxCheck from "./CheckboxCheck";
import Handler from "../../../core/utils/events/Handler";

class Checkbox extends Widget {
    public cssName = css.checkboxLabeled;

    protected elm: Element;
    private checkbox: CheckboxCheck;
    private labelElm?: HTMLElement;

    private label?: string;

    constructor(label?: string) {
        super();
        this.elm = document.createElement("div");

        this.label = label;
        this.labelElm = this.createLabelElm();
        this.checkbox = new CheckboxCheck();
    }

    public setup(): void {
        super.setup();

        this.checkbox.setup();
        this.checkbox.appendTo(this.elm);

        if (this.label) {
            this.checkbox.setLabel(this.label);
            this.elm.appendChild(this.labelElm!);
        }
    }

    public setChecked(checked: boolean): void {
        this.checkbox.setChecked(checked);
    }

    public toggleChecked(): void {
        this.checkbox.toggleChecked();
    }

    public onChange(handler: Handler<boolean>): void {
        this.checkbox.onChange(handler);
    }

    public offChange(handler: Handler<boolean>): void {
        this.checkbox.offChange(handler);
    }

    public isChecked(): boolean {
        return this.checkbox.isChecked();
    }

    private createLabelElm(): HTMLDivElement | undefined {
        if (!this.label) { return; }

        const label = document.createElement("div");
        label.classList.add(css.label);
        label.innerText = this.label;
        label.setAttribute("aria-hidden", "true"); // title on checkbox should be read
        return label;
    }
}

export default Checkbox;