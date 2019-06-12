import ViewMap from "../../../core/view/viewMap";
import View from "../../../core/view/view";
import IApp from "../../../core/types/app/iApp";

class BrowseProjects extends View {
    protected elm: HTMLDivElement;
    public static viewName: string = "BrowseProjects";

    constructor(app: IApp) {
        super(app);
        this.elm = document.createElement("div");
    }

    
}

ViewMap.add(BrowseProjects);

export default BrowseProjects;