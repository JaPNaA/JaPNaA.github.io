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

    constructor(app: IApp) {
        super();
        this.elm = document.createElement("div");
        this.latestProjectsList = this.createLatestProjectsListElm();
        this.heading = this.createHeading();

        this.app = app;

        this.gen = ContentMan.cardGeneratorLatestWithLocation();
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
            this.latestProjectsList.appendChild(await this.createNextLatestProject());
        }
    }

    private async createNextLatestProject(): Promise<HTMLDivElement> {
        const project = (await this.gen.next()).value;
        const elm = document.createElement("div");
        elm.classList.add("project");

        if (isV2Project(project.project)) {
            const card = new LatestProjectCard(this.app, project as IWithLocation<V2Project>);
            card.setup();
            card.appendTo(elm);
        } else {
            elm.classList.add("error");
            elm.innerText = "Unsupported project type";
        }

        return elm;
    }
}

WidgetMap.add(LatestProjects);

export default LatestProjects;