import View from "./view";
import App from "../app";

class Overview extends View {
    public viewName = "Overview";
    protected elm: HTMLDivElement;

    constructor(app: App) {
        super(app);
        this.elm = document.createElement("div");
    }

    public setup() {
        super.setup();
        this.elm.innerText = "Overview of my work";

        //
    }
}

export default Overview;