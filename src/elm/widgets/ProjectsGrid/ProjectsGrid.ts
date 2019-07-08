import "../../../../styles/widgets/projectsGrid.less";

import IApp from "../../../core/types/app/IApp";
import ProjectCardFactory from "./ProjectCardFactory";
import ProjectCard from "./projectCard/ProjectCard";
import DynamicGridDisplay from "../../../components/dynamicGrid/DynamicGridDisplay";
import IProjectLink from "../../../components/contentMan/IProjectLink";
import isProjectLink from "../../../utils/isProjectLink";
import isWithLocation from "../../../utils/isProjectCardWithLocation";
import Widget from "../../../core/widget/Widget";
import WidgetMap from "../../../core/widget/WidgetMap";
import ContentMan from "../../../components/contentMan/contentMan";
import { Rect, newRect } from "../../../types/math/Rect";
import IWithLocation from "../../../components/contentMan/IWithLocation";
import V1Or2Card from "../../../components/contentMan/V1Or2Card";
import IV1Card from "../../../types/project/v1/IV1Card";
import { V2Project } from "../../../types/project/v2/V2Types";
import isV2Project from "../../../utils/isV2Project";

class ProjectsGrid extends Widget {
    protected elm: HTMLDivElement;
    public static widgetName: string = "projectsGrid";
    public widgetName = ProjectsGrid.widgetName;
    private app: IApp;

    private static readonly minColWidth = 128;
    private static readonly minColumns = 4;
    private static readonly initalColumns = 11;

    private projectCards: ProjectCard[];
    private grid: DynamicGridDisplay<ProjectCard>;
    private addingToScreenFull: boolean;

    private cardGenerator: AsyncIterableIterator<IWithLocation<V1Or2Card> | IProjectLink>;

    constructor(app: IApp, cardGenerator?: AsyncIterableIterator<IWithLocation<V1Or2Card> | IProjectLink>) {
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

        this.addCardsIfAtEnd();
    }

    public isOverflowing(): boolean {
        return this.elm.scrollHeight > this.elm.clientHeight;
    }

    private scrollHandler(): void {
        this.addCardsIfAtEnd();
    }

    private addCardsIfAtEnd(): void {
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

            if (card) {
                if (card.isVisible(viewport)) {
                    count = 0;
                } else {
                    count++;
                    // append 5 after detected end
                    if (count > 5) {
                        this.app.events.dispatchViewChange();
                        break;
                    }
                }
            } else {
                break;
            }
        }

        this.addingToScreenFull = false;
    }

    private getViewportRect(): Rect {
        const bbox = this.elm.getBoundingClientRect();
        return newRect(bbox.left, bbox.top, bbox.width, bbox.height);
    }

    private async addNextCard(): Promise<ProjectCard | undefined> {
        let item: IWithLocation<V1Or2Card> | IProjectLink;
        let done = false;

        do {
            const state = await this.cardGenerator.next();
            item = state.value;
            done = state.done;
        } while (
            !isWithLocation(item) &&
            !isProjectLink(item) &&
            !done
        );

        if (done) {
            return undefined;
        } else if (isWithLocation(item)) {
            if (isV2Project(item.project)) {
                return await this.addV2(item as IWithLocation<V2Project>);
            } else {
                return await this.addV1(item as IWithLocation<IV1Card>);
            }
        } else if (isProjectLink(item)) {
            return await this.addLink(item.name, item.href);
        }
    }

    private addV1(card: IWithLocation<IV1Card>): Promise<ProjectCard> {
        const v1 = ProjectCardFactory.createV1(this.app, card);
        return this.addCard(v1);
    }

    private addV2(project: IWithLocation<V2Project>) {
        const v2 = ProjectCardFactory.createV2(this.app, project);
        return this.addCard(v2);
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