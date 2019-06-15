import "../../../../styles/views/browseProjects.less";

import ViewMap from "../../../core/view/viewMap";
import View from "../../../core/view/view";
import IApp from "../../../core/types/app/iApp";
import ICard from "../../../types/project/card";
import ProjectCardFactory from "./projectCardFactory";
import ProjectCard from "./projectCard";
import ContentMan from "../../../components/contentMan/contentMan";
import IProject from "../../../types/project/project";
import isProjectCard from "../../../utils/isProjectCard";
import DynamicGridDisplay from "../../../components/dynamicGrid/DynamicGridDisplay";

class BrowseProjects extends View {
    protected elm: HTMLDivElement;
    public static viewName: string = "BrowseProjects";
    public viewName = BrowseProjects.viewName;
    public isFullPage = true;

    private projectCards: ProjectCard[];
    private grid: DynamicGridDisplay<ProjectCard>;

    private cardGenerator: AsyncIterableIterator<IProject>;

    constructor(app: IApp) {
        super(app);
        this.elm = document.createElement("div");
        this.projectCards = [];
        this.grid = new DynamicGridDisplay(11, 100 /* percent */, 64, 2);
        this.cardGenerator = ContentMan.cardGeneratorLatest();
    }

    public async setup() {
        await super.setup();

        this.addCardsUntilScreenFull();
        // this.events.onResize(() => this.grid.resizeElementSize(this.app.width, 64));
    }

    private async addCardsUntilScreenFull() {
        while (true) {
            const card = await this.addNextCard();
            if (!card || !card.isVisible()) { break; }
        }
    }

    private async addNextCard(): Promise<ProjectCard | undefined> {
        let card;
        let done = false;

        do {
            const state = await this.cardGenerator.next();
            card = state.value;
            done = state.done;
        } while (!isProjectCard(card) && !done);

        if (isProjectCard(card) && !done) {
            return await this.addCard(card);
        } else {
            return undefined;
        }
    }

    private async addCard(card: ICard): Promise<ProjectCard> {
        const projectCard = ProjectCardFactory.create(this.app, card);
        this.projectCards.push(projectCard);
        projectCard.appendTo(this.elm);
        await projectCard.load();
        this.grid.addElement(projectCard, projectCard.width, projectCard.height);
        return projectCard;
    }
}

ViewMap.add(BrowseProjects);

export default BrowseProjects;