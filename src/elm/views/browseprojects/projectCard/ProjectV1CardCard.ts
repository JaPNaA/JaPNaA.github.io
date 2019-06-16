import ProjectCard from "./ProjectCard";
import ICard from "../../../../types/project/card";
import IApp from "../../../../core/types/app/iApp";
import random from "../../../../utils/random";
import getFirstDisplayImgSrc from "../../../../components/jsonToElm/v1/getFirstDisplayImg";
import SiteConfig from "../../../../siteConfig";
import SiteResources from "../../../../core/siteResources";

class ProjectV1CardCard extends ProjectCard {
    public width: number;
    public height: number;

    protected cardTitle: string;
    protected cardDescription: string;

    private year: number;
    private index: number
    private card: ICard;

    constructor(app: IApp, card: ICard, year: number, index: number) {
        super(app);
        this.card = card;
        this.year = year;
        this.index = index;

        this.width = random(3, 4, 1);
        this.height = random(5, 7, 1);

        this.cardTitle = card.name;
        this.cardDescription = card.content.description;
    }

    public load(): Promise<void> {
        this.useStyles();
        return super.load();
    }

    protected createBackground(): HTMLDivElement {
        const firstDisplay = getFirstDisplayImgSrc(this.card);
        if (!firstDisplay) { return super.createBackground(); }
        const path = SiteConfig.path.thingy + firstDisplay;
        SiteResources.loadImage(path);

        const background = super.createBackground();
        background.style.backgroundImage = "url(" + path + ")";
        return background;
    }

    private useStyles() {
        if (this.card.style) {
            this.cardElm.style.cssText = this.card.style;
        }
    }

    protected clickHandler(): void {
        // TODO: Animate expanding instead of just switching views
        this.app.views.switchAndInit("ProjectInfo", this.year + "." + this.index);
    }
}

export default ProjectV1CardCard;