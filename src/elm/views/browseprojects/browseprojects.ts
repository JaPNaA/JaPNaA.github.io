import "../../../../styles/views/browseProjects.less";

import ViewMap from "../../../core/view/viewMap";
import View from "../../../core/view/view";
import IApp from "../../../core/types/app/iApp";
import ICard from "../../../types/project/card";
import ProjectCardFactory from "./projectCardFactory";
import ProjectCard from "./projectCard";
import ContentMan from "../../../components/contentMan/contentMan";
import isProjectCard from "../../../utils/isProjectCard";
import DynamicGridDisplay from "../../../components/dynamicGrid/DynamicGridDisplay";
import IProjectWithLocation from "../../../components/contentMan/IProjectWithLocation";

class BrowseProjects extends View {
    protected elm: HTMLDivElement;
    public static viewName: string = "BrowseProjects";
    public viewName = BrowseProjects.viewName;
    public isFullPage = true;

    private projectCards: ProjectCard[];
    private grid: DynamicGridDisplay<ProjectCard>;
    private addingToScreenFull: boolean;

    private cardGenerator: AsyncIterableIterator<IProjectWithLocation>;

    constructor(app: IApp) {
        super(app);
        this.elm = document.createElement("div");
        this.projectCards = [];
        this.grid = new DynamicGridDisplay(11, 100 /* percent */, 64, 2);
        this.cardGenerator = ContentMan.cardGeneratorLatestWithLocation();
        this.addingToScreenFull = false;
    }

    public async setup() {
        await super.setup();

        this.addCardsUntilScreenFull();
        this.elm.addEventListener("scroll", this.scrollHandler.bind(this));
        // this.events.onResize(() => this.grid.resizeElementSize(this.app.width, 64));
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

        while (true) {
            const card = await this.addNextCard();
            if (card && card.isVisible()) {
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

    private async addNextCard(): Promise<ProjectCard | undefined> {
        let card;
        let done = false;

        do {
            const state = await this.cardGenerator.next();
            card = state.value;
            done = state.done;
        } while (card && !isProjectCard(card.project) && !done);

        if (card && isProjectCard(card.project) && !done) {
            return await this.addCard(card.project, card.year, card.index);
        } else {
            return undefined;
        }
    }

    // TODO: refactor, lower amount of arguments
    private async addCard(card: ICard, year: number, index: number): Promise<ProjectCard> {
        const projectCard = ProjectCardFactory.create(this.app, card, year, index);
        this.projectCards.push(projectCard);
        projectCard.appendTo(this.elm);
        projectCard.setup();
        await projectCard.load();
        this.grid.addElement(projectCard, projectCard.width, projectCard.height);
        return projectCard;
    }
}

ViewMap.add(BrowseProjects);

export default BrowseProjects;