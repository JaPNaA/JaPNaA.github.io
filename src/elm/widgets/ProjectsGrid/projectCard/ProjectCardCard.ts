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

    private backgroundImage?: string;
    private backgroundImageSrc?: string;

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
        this.backgroundImage = this.getBackgroundImage();
        if (this.backgroundImage) {
            this.backgroundImageSrc = this.getBackgroundImageSrcFromBackgroundImage(this.backgroundImage);

            if (this.backgroundImageSrc) {
                const img = await siteResources.loadImagePromise(this.backgroundImageSrc);
                this.height = Math.round(Math.sqrt(ProjectCardCard.size * img.height / img.width));
                this.width = Math.round(Math.sqrt(ProjectCardCard.size * img.width / img.height));
            }
        }

        return super.load();
    }

    protected abstract getCardTitle(card: T): string;
    protected abstract getCardDescription(card: T): string;
    protected abstract getBackgroundImage(): string | undefined;

    protected getBackgroundImageSrcFromBackgroundImage(backgroundImage: string): string | undefined {
        return siteConfig.path.thingy + backgroundImage;
    }

    protected setBackgroundImage(elm: HTMLElement, backgroundImage: string): void {
        elm.style.backgroundImage = "url(" + siteConfig.path.thingy + backgroundImage + ")";
    }

    protected createBackground(): HTMLDivElement {
        if (!this.backgroundImage) { return super.createBackground(); }
        const background = super.createBackground();
        this.setBackgroundImage(background, this.backgroundImage);
        return background;
    }

    protected linkClickHandler(): void {
        // TODO: Animate expanding instead of just switching views
        this.app.views.switchAndInit("ProjectInfo", this.year + "." + this.index);
    }
}

export default ProjectCardCard;