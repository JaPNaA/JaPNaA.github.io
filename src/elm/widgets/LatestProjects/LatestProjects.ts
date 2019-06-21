import Widget from "../../../core/widget/widget";
import WidgetMap from "../../../core/widget/widgetMap";
import IApp from "../../../core/types/app/iApp";
import ContentMan from "../../../components/contentMan/contentMan";

class LatestProjects extends Widget {
    public static widgetName = "LatestProjects";
    protected elm: HTMLDivElement;

    private app: IApp;

    constructor(app: IApp) {
        super();
        this.elm = document.createElement("div");
        this.app = app;
    }

    public setup(): void {
        super.setup();
        this.elm.innerHTML = "Latest projects";
    }
}

WidgetMap.add(LatestProjects);

export default LatestProjects;