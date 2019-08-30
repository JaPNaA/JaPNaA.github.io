import "../../../../styles/widgets/latestProjects.less";

import { V2Project } from "../../../types/project/v2/V2Types";
import ContentMan from "../../../components/contentMan/contentMan";
import IApp from "../../../core/types/app/IApp";
import isV2Project from "../../../utils/v2Project/isV2Project";
import IWithLocation from "../../../components/contentMan/IWithLocation";
import LatestProjectCard from "./LatestProjectCard";
import V1Or2Project from "../../../components/contentMan/V1Or2Project";
import Widget from "../../../core/widget/Widget";
import WidgetMap from "../../../core/widget/WidgetMap";

class LatestProjects extends Widget {
    public static widgetName = "latestProjects";
    public widgetName = LatestProjects.widgetName;

    protected elm: HTMLDivElement;

    private latestProjectsList: HTMLDivElement;
    private heading: HTMLHeadingElement;

    private app: IApp;
    private gen: AsyncIterableIterator<IWithLocation<V1Or2Project>>;
    private latestProjectCardCreated: boolean;

    constructor(app: IApp) {
        super();
        this.app = app;

        this.elm = document.createElement("div");
        this.latestProjectsList = this.createLatestProjectsListElm();
        this.heading = this.createHeading();

        this.gen = ContentMan.cardGeneratorLatestWithLocation();
        this.latestProjectCardCreated = false;
    }

    public setup(): void {
        super.setup();

        this.setupLatestProjects();
        this.elm.appendChild(this.heading);
        this.elm.appendChild(this.latestProjectsList);
    }

    private createLatestProjectsListElm(): HTMLDivElement {
        const elm = document.createElement("div");
        elm.classList.add("list");
        return elm;
    }

    private createHeading(): HTMLHeadingElement {
        const heading = document.createElement("h2");
        heading.classList.add("heading");
        heading.innerText = "My Latest Projects";
        return heading;
    }

    private async setupLatestProjects(): Promise<void> {
        for (let i = 0; i < 3; i++) {
            await this.addNextLatestProject();
        }
    }

    private async addNextLatestProject(): Promise<void> {
        const project = (await this.gen.next()).value;

        if (isV2Project(project.project)) {
            const card = new LatestProjectCard(this.app, project as IWithLocation<V2Project>);
            card.setup();
            card.appendTo(this.latestProjectsList);

            if (!this.latestProjectCardCreated) {
                card.setAsLatest();
                this.latestProjectCardCreated = true;
            }
        } else {
            const elm = document.createElement("div");
            elm.classList.add("error");
            elm.innerText = "Unsupported project type. See this error? Please file a bug report!";
            this.latestProjectsList.appendChild(elm);
        }
    }
}

WidgetMap.add(LatestProjects);

export default LatestProjects;