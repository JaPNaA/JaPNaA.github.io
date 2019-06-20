import "../../../../styles/widgets/projectsGrid.less";

import IApp from "../../../core/types/app/iApp";
import ProjectCardFactory from "./ProjectCardFactory";
import ProjectCard from "./projectCard/ProjectCard";
import DynamicGridDisplay from "../../../components/dynamicGrid/DynamicGridDisplay";
import IProjectLink from "../../../components/contentMan/IProjectLink";
import ICardWithLocation from "../../../components/contentMan/ICardWithLocation";
import isProjectLink from "../../../utils/isProjectLink";
import isProjectCardWithLocation from "../../../utils/isProjectCardWithLocation";
import Widget from "../../../core/widget/widget";
import WidgetMap from "../../../core/widget/widgetMap";
import ContentMan from "../../../components/contentMan/contentMan";
import { Rect, newRect } from "../../../types/math/rect";

class ProjectsGrid extends Widget {
    protected elm: HTMLDivElement;
    public static widgetName: string = "ProjectsGrid";
    public widgetName = ProjectsGrid.widgetName;
    private app: IApp;

    private static readonly minColWidth = 128;
    private static readonly minColumns = 4;
    private static readonly initalColumns = 11;

    private projectCards: ProjectCard[];
    private grid: DynamicGridDisplay<ProjectCard>;
    private addingToScreenFull: boolean;

    private cardGenerator: AsyncIterableIterator<ICardWithLocation | IProjectLink>;

    constructor(app: IApp, cardGenerator?: AsyncIterableIterator<ICardWithLocation | IProjectLink>) {
        super();
        this.app = app;
        this.elm = document.createElement("div");
        this.projectCards = [];
        this.grid = new DynamicGridDisplay(ProjectsGrid.initalColumns, 100 /* percent */, app.width / ProjectsGrid.initalColumns, 2);
        this.cardGenerator = cardGenerator || ContentMan.cardAndLinkGeneratorLatestWithLocation();
        this.addingToScreenFull = false;
    }

    public async setup() {
        await super.setup();

        this.addCardsUntilScreenFull();
        this.elm.addEventListener("scroll", this.scrollHandler.bind(this));
    }

    public resize(width: number, height: number): void {
        const columns = Math.max(
            ProjectsGrid.minColumns,
            Math.floor(width / ProjectsGrid.minColWidth)
        );
        const scrollTarget = this.grid.getFirstElementAt(this.elm.scrollTop);
        const scrollTargetDY = scrollTarget ? scrollTarget.getDY() : 0;

        if (this.grid.gridColumns !== columns) {
            this.grid.resizeGridColumns(columns);
        }
        this.grid.resizeElementSize(100, width / columns);

        if (scrollTarget) {
            const dy = scrollTarget.getDY();
            this.elm.scrollBy(0, dy - scrollTargetDY);
        }

        this.elm.style.width = width + "px";
        this.elm.style.height = height + "px";
    }

    private scrollHandler(): void {
        const bottomY = this.elm.scrollTop + this.elm.clientHeight;
        if (this.grid.isAfterFirstOpenRow(bottomY)) {
            this.addCardsUntilScreenFull();
        }
    }

    private async addCardsUntilScreenFull(): Promise<void> {
        if (this.addingToScreenFull) { return; }
        let count = 0;
        this.addingToScreenFull = true;

        const viewport = this.getViewportRect();
        while (true) {
            const card = await this.addNextCard();

            if (card && card.isVisible(viewport)) {
                count = 0;
            } else {
                count++;
                // append 3 after detected end
                if (count > 3) {
                    break;
                }
            }
        }

        this.addingToScreenFull = false;
    }

    private getViewportRect(): Rect {
        const bbox = this.elm.getBoundingClientRect();
        return newRect(bbox.left, bbox.top, bbox.width, bbox.height);
    }

    private async addNextCard(): Promise<ProjectCard | undefined> {
        let item;
        let done = false;

        do {
            const state = await this.cardGenerator.next();
            item = state.value;
            done = state.done;
        } while (
            !isProjectCardWithLocation(item) &&
            !isProjectLink(item) &&
            !done
        );

        if (done) {
            return undefined;
        } else if (isProjectCardWithLocation(item)) {
            return await this.addV1(item);
        } else if (isProjectLink(item)) {
            return await this.addLink(item.name, item.href);
        }
    }

    private addV1(card: ICardWithLocation): Promise<ProjectCard> {
        const v1 = ProjectCardFactory.createV1(this.app, card);
        return this.addCard(v1);
    }

    private addLink(name: string, href: string): Promise<ProjectCard> {
        const link = ProjectCardFactory.createLink(this.app, name, href);
        return this.addCard(link);
    }

    private async addCard(projectCard: ProjectCard): Promise<ProjectCard> {
        this.projectCards.push(projectCard);
        projectCard.appendTo(this.elm);
        projectCard.setup();
        await projectCard.load();
        this.grid.addElement(projectCard, projectCard.width, projectCard.height);
        return projectCard;
    }
}

WidgetMap.add(ProjectsGrid);

export default ProjectsGrid;