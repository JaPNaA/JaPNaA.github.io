import "../../../../styles/widgets/projectsGrid.less";

import IApp from "../../../core/types/app/IApp";
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
import PositionableProjectCard from "./PositionableProjectCard";
import ProjectCardInitData from "../ProjectCard/ProjectCardInitData";

// todo: predict amount of projects to load based on user scroll speed

class ProjectsGrid extends Widget {
    protected elm: HTMLDivElement;
    public static widgetName: string = "projectsGrid";
    public widgetName = ProjectsGrid.widgetName;
    private app: IApp;

    private static readonly minColWidth = 128;
    private static readonly minColumns = 4;
    private static readonly initalColumns = 11;

    private projectCards: PositionableProjectCard[];
    private grid: DynamicGridDisplay<PositionableProjectCard>;
    private addingToScreenFull: boolean;

    private width: number;
    private height: number;

    private cardGenerator: AsyncIterableIterator<IWithLocation<V1Or2Card> | IProjectLink>;

    constructor(app: IApp, cardGenerator?: AsyncIterableIterator<ProjectCardInitData>) {
        super();
        this.app = app;
        this.elm = document.createElement("div");
        this.projectCards = [];
        this.grid = new DynamicGridDisplay(ProjectsGrid.initalColumns, 100 /* percent */, app.width / ProjectsGrid.initalColumns, 2);
        this.cardGenerator = cardGenerator || ContentMan.cardAndLinkGeneratorLatestWithLocation();
        this.addingToScreenFull = false;

        this.width = 0;
        this.height = 0;
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
        const scrollTargetDY = scrollTarget ? scrollTarget.getClientRect().y : 0;

        this.width = width;
        this.height = height;

        if (this.grid.gridColumns !== columns) {
            this.grid.resizeGridColumns(columns);
        }
        this.grid.resizeElementSize(100, width / columns);

        if (scrollTarget) {
            const dy = scrollTarget.getClientRect().y;
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
        return newRect(bbox.left, bbox.top, this.width, this.height);
    }

    private async addNextCard(): Promise<PositionableProjectCard | undefined> {
        let item: ProjectCardInitData;
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
        }

        const card = new PositionableProjectCard(this.app, item);
        await this.addCard(card);
        return card;
    }

    private async addCard(positionableProjectCard: PositionableProjectCard): Promise<PositionableProjectCard> {
        this.projectCards.push(positionableProjectCard);
        positionableProjectCard.appendTo(this.elm);
        positionableProjectCard.setup();
        await positionableProjectCard.projectCard.load();
        this.grid.addElement(positionableProjectCard, positionableProjectCard.projectCard.width, positionableProjectCard.projectCard.height);
        return positionableProjectCard;
    }
}

WidgetMap.add(ProjectsGrid);

export default ProjectsGrid;