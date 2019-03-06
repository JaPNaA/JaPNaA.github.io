import View from "./view";
import App from "../app";
import ProjectDetailedView from "./projectDetailed";

class Overview extends View {
    public viewName = "Overview";
    protected elm: HTMLDivElement;
    public isFullPage = true;

    constructor(app: App) {
        super(app);
        this.elm = document.createElement("div");
    }

    public setup() {
        super.setup();
        this.elm.innerText = "Overview of my work";

        const year = document.createElement("input");
        this.elm.appendChild(year);
        const num = document.createElement("input");
        this.elm.appendChild(num);

        const button = document.createElement("button");
        button.innerText = "test";
        this.elm.appendChild(button);

        button.addEventListener("click", async function(this: Overview) {
            const proj = await fetch("./content/" + year.value + ".json").then(e => e.json());
            const projectScene = new ProjectDetailedView(this.app, proj.data[num.value]);
            projectScene.setup();
            this.app.switchView(projectScene);
        }.bind(this));
    }
}

export default Overview;