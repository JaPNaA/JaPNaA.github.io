import View from "./_view";
import App from "../app";
import ProjectDetailedView from "./projectDetailed";
import ViewMap from "./_list";

class Overview extends View {
    public static viewName = "Overview";
    public viewName = Overview.viewName;

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

        button.addEventListener("click", async function (this: Overview) {
            const proj = await fetch("./content/" + year.value + ".json").then(e => e.json());
            const projectScene = new ProjectDetailedView(this.app);
            projectScene.setProject(proj.data[num.value]);
            projectScene.setup();
            this.app.switchView(projectScene);
        }.bind(this));
    }
}

ViewMap.add(Overview);

export default Overview;