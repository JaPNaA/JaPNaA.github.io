import "../../../../styles/components/cardV2.less";

import Widget from "../../../core/widget/Widget";
import { V2Project } from "../../../types/project/v2/V2Types";
import WidgetMap from "../../../core/widget/WidgetMap";
import IApp from "../../../core/types/app/IApp";
import ContentMan from "../../contentMan/contentMan";
import HexagonsCorner from "./hexagons/HexagonsCorner";

class ProjectJSONv2Elm extends Widget {
    public static widgetName = "projectJSONv2Elm";
    public widgetName = ProjectJSONv2Elm.widgetName;
    protected elm: HTMLDivElement;

    private project: V2Project;
    private app: IApp;

    private backgroundContainer: HTMLDivElement;
    private contentContainer: HTMLDivElement;
    private mainContent: HTMLDivElement;
    private title: HTMLHeadingElement;
    private body: HTMLDivElement;
    private hexagons: HexagonsCorner;

    constructor(app: IApp, project: V2Project) {
        super();
        this.app = app;
        this.project = project;
        this.elm = document.createElement("div");

        this.backgroundContainer = this.createBackground();
        this.contentContainer = this.createContentContainer();
        this.mainContent = this.createMainContent();
        this.title = this.createTitle(project.head.name);
        this.body = this.createBody();
        this.hexagons = new HexagonsCorner(app);
    }

    public canScroll(): boolean {
        return this.backgroundContainer.clientHeight > this.elm.clientHeight;
    }

    public setup(): void {
        super.setup();
        this.loadBody();

        this.elm.appendChild(this.backgroundContainer);
        this.backgroundContainer.appendChild(this.contentContainer);
        this.contentContainer.appendChild(this.mainContent);
        this.mainContent.appendChild(this.title);
        this.mainContent.appendChild(this.body);
        this.hexagons.appendTo(this.backgroundContainer);

        this.addEventHandlers();
    }

    private addEventHandlers(): void {
        this.elm.addEventListener("scroll", this.scrollHandler.bind(this));

        this.setupScrollHandler();
    }

    private setupScrollHandler() {
        this.body.classList.add("hidden");
    }

    private createBackground(): HTMLDivElement {
        const background = document.createElement("div");
        background.classList.add("background");
        return background;
    }

    private createContentContainer(): HTMLDivElement {
        const container = document.createElement("div");
        container.classList.add("contentContainer");
        return container;
    }

    private createMainContent(): HTMLDivElement {
        const main = document.createElement("div");
        main.classList.add("mainContent");
        return main;
    }

    private createTitle(text: string): HTMLHeadingElement {
        const title = document.createElement("h1");
        title.classList.add("title");
        title.innerText = text;
        return title;
    }

    private createBody(): HTMLDivElement {
        const body = document.createElement("div");
        body.classList.add("body");
        return body;
    }

    private async loadBody(): Promise<void> {
        this.body.innerText = JSON.stringify(await ContentMan.getV2CardBody(this.project));
    }

    private scrollHandler(): void {
        if (this.elm.scrollTop <= 0) {
            this.body.classList.add("hidden");
        } else {
            this.body.classList.remove("hidden");
        }
    }
}

WidgetMap.add(ProjectJSONv2Elm);

export default ProjectJSONv2Elm;