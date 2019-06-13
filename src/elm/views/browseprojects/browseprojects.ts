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
import GridElementManager from "./gridElementManager";

class BrowseProjects extends View {
    protected elm: HTMLDivElement;
    public static viewName: string = "BrowseProjects";

    private projectCards: ProjectCard[];
    private grid: GridElementManager<ProjectCard>;

    private cardGenerator: AsyncIterableIterator<IProject>;


    constructor(app: IApp) {
        super(app);
        this.elm = document.createElement("div");
        this.projectCards = [];
        this.grid = new GridElementManager(11, app.width, 64, 2);
        this.cardGenerator = ContentMan.cardGeneratorLatest();
    }

    public async setup() {
        await super.setup();

        this.addCardsUntilScreenFull();
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
        const projectCard = ProjectCardFactory.create(card);
        this.projectCards.push(projectCard);
        projectCard.appendTo(this.elm);
        await projectCard.load();
        const rect = this.grid.addElement(projectCard,
            Math.floor(Math.random() * 2) + 2,
            Math.floor(Math.random() * 2) + 2
        );
        projectCard.setRect(rect);
        return projectCard;
    }
}

ViewMap.add(BrowseProjects);

export default BrowseProjects;