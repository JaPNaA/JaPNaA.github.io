import Widget from "../../../core/widget/Widget";
import WidgetMap from "../../../core/widget/WidgetMap";
import IApp from "../../../core/types/app/IApp";
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