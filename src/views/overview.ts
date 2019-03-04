import View from "./view";

class Overview extends View {
    protected sceneName = "Overview";
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