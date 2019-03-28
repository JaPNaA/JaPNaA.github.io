import View from "../view";
import IApp from "../../../types/app/iApp";
import ViewMap from "../viewMap";

class AllProjects extends View {
    public static viewName = "AllProjects";
    public viewName = AllProjects.viewName;
    protected elm: HTMLDivElement;

    public isFullPage = true;

    constructor(app: IApp) {
        super(app)
        this.elm = document.createElement("div");
    }

    public async setup() {
        super.setup();
        this.elm.innerText = "All my projects";
    }
}

ViewMap.add(AllProjects);

export default AllProjects;