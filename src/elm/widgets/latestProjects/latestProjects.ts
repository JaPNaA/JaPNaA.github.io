import Widget from "../widget";
import WidgetMap from "../widgetMap";
import IApp from "../../../types/app/iApp";
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

        const gen = ContentMan.cardGeneratorLatest();

        function next() {
            gen.next().then(
                e => {
                    if (!e.done) {
                        next();
                    }
                    console.log(e);
                }
            );
        }
        next();
    }
}

WidgetMap.add(LatestProjects);

export default LatestProjects;