import css from "./latestProjects.less";
import commonCSS from "../../../../styles/common.less";

import { V2Project } from "../../../types/project/v2/V2Types";
import ContentMan from "../../../components/contentMan/contentMan";
import IApp from "../../../core/types/app/IApp";
import IWithLocation from "../../../components/contentMan/IWithLocation";
import LatestProjectCard from "./LatestProjectCard";
import Widget from "../../../core/widget/Widget";
import resolveUrl from "../../../utils/resolveUrl";

class LatestProjects extends Widget {
    public cssName = css.latestProjects;

    protected elm: HTMLDivElement;

    private latestProjectsList: HTMLDivElement;
    private heading: HTMLHeadingElement;
    private viewMoreElm: HTMLDivElement;

    private app: IApp;
    private gen: AsyncIterableIterator<IWithLocation<V2Project>>;
    private latestProjectCardCreated: boolean;

    constructor(app: IApp) {
        super();
        this.app = app;

        this.elm = document.createElement("div");
        this.latestProjectsList = this.createLatestProjectsListElm();
        this.heading = this.createHeading();
        this.viewMoreElm = this.createViewMoreElm();

        this.gen = ContentMan.cardGeneratorLatestWithLocation();
        this.latestProjectCardCreated = false;
    }

    public setup(): void {
        super.setup();

        this.setupLatestProjects();
        this.elm.appendChild(this.heading);
        this.elm.appendChild(this.latestProjectsList);
        this.elm.appendChild(this.viewMoreElm);
    }

    private createLatestProjectsListElm(): HTMLDivElement {
        const elm = document.createElement("div");
        elm.classList.add(css.list);
        return elm;
    }

    private createHeading(): HTMLHeadingElement {
        const heading = document.createElement("h1");
        heading.classList.add(css.heading);
        heading.innerText = "My Latest Projects";
        return heading;
    }

    private createViewMoreElm(): HTMLDivElement {
        const div = document.createElement("div");
        div.classList.add(css.viewMore);

        const a = document.createElement("a");
        a.classList.add(commonCSS.flatButton);
        a.href = resolveUrl("/browseprojects");
        a.innerText = "View More Projects";
        a.addEventListener("click", this.onViewMoreClick.bind(this));
        div.appendChild(a);

        return div;
    }

    private async setupLatestProjects(): Promise<void> {
        for (let i = 0; i < 3; i++) {
            await this.addNextLatestProject();
        }
    }

    private async addNextLatestProject(): Promise<void> {
        const project = (await this.gen.next()).value;

        const card = new LatestProjectCard(this.app, project as IWithLocation<V2Project>);
        card.setup();
        card.appendTo(this.latestProjectsList);

        if (!this.latestProjectCardCreated) {
            card.setAsLatest();
            this.latestProjectCardCreated = true;
        }
    }

    private onViewMoreClick(e: MouseEvent): void {
        e.preventDefault();
        this.app.views.switchAndInit("project/browse");
    }
}

export default LatestProjects;