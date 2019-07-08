import ProjectCard from "./ProjectCard";
import IV1Card from "../../../../types/project/v1/IV1Card";
import IApp from "../../../../core/types/app/IApp";
import getFirstDisplayImgSrc from "../../../../components/jsonToElm/v1/getFirstDisplayImg";
import siteConfig from "../../../../SiteConfig";
import siteResources from "../../../../core/siteResources";
import addZeroWidthSpacesBetweenCamelCaseWords from "../../../../utils/addZeroWidthSpacesBetweenCamelCaseWords";

class ProjectV1CardCard extends ProjectCard {
    public width: number;
    public height: number;

    protected cardTitle: string;
    protected cardDescription: string;

    private static size: number = 20;

    private year: number;
    private index: number
    private card: IV1Card;

    constructor(app: IApp, card: IV1Card, year: number, index: number) {
        super(app);
        this.card = card;
        this.year = year;
        this.index = index;

        this.width = 3;
        this.height = 3;

        this.cardTitle = addZeroWidthSpacesBetweenCamelCaseWords(card.name);
        this.cardDescription = card.content.description;
        this.href = "/projectinfo/" + this.year + "." + this.index;
    }

    public async load(): Promise<void> {
        const firstDisplay = getFirstDisplayImgSrc(this.card);
        if (firstDisplay) {
            const path = siteConfig.path.thingy + firstDisplay;
            await new Promise(res => {
                siteResources.loadImage(path)
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
        const path = siteConfig.path.thingy + firstDisplay;
        siteResources.loadImage(path);

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