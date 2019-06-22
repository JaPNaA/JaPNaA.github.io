import ProjectCard from "./ProjectCard";
import ICard from "../../../../types/project/card";
import IApp from "../../../../core/types/app/iApp";
import getFirstDisplayImgSrc from "../../../../components/jsonToElm/v1/getFirstDisplayImg";
import SiteConfig from "../../../../siteConfig";
import SiteResources from "../../../../core/siteResources";

class ProjectV1CardCard extends ProjectCard {
    public width: number;
    public height: number;

    protected cardTitle: string;
    protected cardDescription: string;

    private static size: number = 20;

    private year: number;
    private index: number
    private card: ICard;

    constructor(app: IApp, card: ICard, year: number, index: number) {
        super(app);
        this.card = card;
        this.year = year;
        this.index = index;

        this.width = 3;
        this.height = 3;

        this.cardTitle = card.name;
        this.cardDescription = card.content.description;
        this.href = "/projectinfo/" + this.year + "." + this.index;
    }

    public async load(): Promise<void> {
        const firstDisplay = getFirstDisplayImgSrc(this.card);
        if (firstDisplay) {
            const path = SiteConfig.path.thingy + firstDisplay;
            await new Promise(res => {
                SiteResources.loadImage(path)
                    .onLoad(e => {
                        this.height = Math.round(Math.sqrt(ProjectV1CardCard.size * e.data.height / e.data.width));
                        this.width = Math.round(Math.sqrt(ProjectV1CardCard.size * e.data.width / e.data.height));
                        res();
                    });
            });
        }

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

    protected linkClickHandler(): void {
        // TODO: Animate expanding instead of just switching views
        this.app.views.switchAndInit("ProjectInfo", this.year + "." + this.index);
    }
}

export default ProjectV1CardCard;