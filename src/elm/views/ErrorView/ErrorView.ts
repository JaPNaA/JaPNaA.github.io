import css from "./ErrorView.less";

import View from "../../../core/view/View";
import IApp from "../../../core/types/app/IApp";
import AppState from "../../../core/types/AppState";

class ErrorView extends View {
    public cssName = css.ErrorView;

    protected elm: HTMLDivElement;

    private heading: HTMLHeadingElement;
    private text: HTMLDivElement;

    private error: string;

    constructor(app: IApp, state: AppState) {
        super(app, state);

        this.error = state.stateData || "Some error occured :(";

        this.elm = document.createElement("div");
        this.heading = this.createHeading();
        this.text = this.createText();
    }

    public setup() {
        super.setup();

        this.elm.appendChild(this.heading);
        this.elm.appendChild(this.text);
    }

    private createHeading(): HTMLHeadingElement {
        const heading = document.createElement("h2");
        heading.classList.add(css.heading);
        heading.innerHTML = "An error occured";
        return heading;
    }

    private createText(): HTMLDivElement {
        const text = document.createElement("div");
        text.classList.add(css.text);
        text.innerText = this.error;
        return text;
    }
}

export default ErrorView;