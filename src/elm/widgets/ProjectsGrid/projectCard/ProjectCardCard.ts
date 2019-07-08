import ProjectCard from "./ProjectCard";
import IApp from "../../../../core/types/app/IApp";
import addZeroWidthSpacesBetweenCamelCaseWords from "../../../../utils/addZeroWidthSpacesBetweenCamelCaseWords";
import siteConfig from "../../../../SiteConfig";
import siteResources from "../../../../core/siteResources";

abstract class ProjectCardCard<T> extends ProjectCard {
    public width: number;
    public height: number;

    protected card: T;
    protected cardTitle: string;
    protected cardDescription: string;

    private static size: number = 20;

    private year: number;
    private index: number

    constructor(app: IApp, card: T, year: number, index: number) {
        super(app);
        this.card = card;
        this.year = year;
        this.index = index;

        this.width = 3;
        this.height = 3;

        this.cardTitle = addZeroWidthSpacesBetweenCamelCaseWords(this.getCardTitle(card));
        this.cardDescription = this.getCardDescription(card);
        this.href = "/projectinfo/" + this.year + "." + this.index;
    }

    public async load(): Promise<void> {
        const firstDisplay = this.getBackgroundImage();
        if (firstDisplay) {
            const path = siteConfig.path.thingy + firstDisplay;
            await new Promise(res => {
                siteResources.loadImage(path)
                    .onLoad(e => {
                        this.height = Math.round(Math.sqrt(ProjectCardCard.size * e.data.height / e.data.width));
                        this.width = Math.round(Math.sqrt(ProjectCardCard.size * e.data.width / e.data.height));
                        res();
                    });
            });
        }

        return super.load();
    }

    protected abstract getCardTitle(card: T): string;
    protected abstract getCardDescription(card: T): string;
    protected abstract getBackgroundImage(): string | undefined;

    protected createBackground(): HTMLDivElement {
        const firstDisplay = this.getBackgroundImage();
        if (!firstDisplay) { return super.createBackground(); }
        const path = siteConfig.path.thingy + firstDisplay;
        siteResources.loadImage(path);

        const background = super.createBackground();
        background.style.backgroundImage = "url(" + path + ")";
        return background;
    }

    protected linkClickHandler(): void {
        // TODO: Animate expanding instead of just switching views
        this.app.views.switchAndInit("ProjectInfo", this.year + "." + this.index);
    }
}

export default ProjectCardCard;