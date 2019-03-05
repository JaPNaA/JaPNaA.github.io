import View from "./view";

class Overview extends View {
    public viewName = "Overview";
    protected elm: HTMLDivElement;

    constructor() {
        super();
        this.elm = document.createElement("div");
    }

    public setup() {
        super.setup();
        this.elm.innerText = "Overview of my work";
    }
}

export default Overview;