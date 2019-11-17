import css from "../projectCard.less";

import BaseProjectCard from "../BaseProjectCard";
import IApp from "../../../../core/types/app/IApp";
import addZeroWidthSpacesBetweenCamelCaseWords from "../../../../utils/addZeroWidthSpacesBetweenCamelCaseWords";
import siteConfig from "../../../../SiteConfig";
import siteResources from "../../../../core/siteResources";
import IProjectInfoView from "../../../views/project/info/IProjectInfo";
import heroViewOpenTransition from "../../../../utils/heroViewOpenTransition";
import urlFromViewState from "../../../../utils/urlFromViewState";
import createAppState from "../../../../core/utils/createAppState";

abstract class ProjectCardCard<T> extends BaseProjectCard {
    public width: number;
    public height: number;

    protected card: T;
    protected cardTitle: string;
    protected cardDescription: string;
    protected isContentDescriptionImportant: boolean = true;

    private static size: number = 20;

    private year: number;
    private index: number

    private backgroundImage?: string;
    private backgroundImageSrc?: string;

    private cardLinkClicked: boolean;

    constructor(app: IApp, card: T, year: number, index: number) {
        super(app);
        this.card = card;
        this.year = year;
        this.index = index;

        this.width = 3;
        this.height = 3;

        this.cardTitle = addZeroWidthSpacesBetweenCamelCaseWords(this.getCardTitle(card));
        this.cardDescription = this.getCardDescription(card);
        this.href = urlFromViewState(createAppState("project/info", this.year + "." + this.index));

        this.cardLinkClicked = false;
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
        if (this.cardLinkClicked) { return; }
        this.cardLinkClicked = true;

        heroViewOpenTransition<IProjectInfoView>(
            this.app,
            css,
            this.cardElm,
            "project/info",
            this.year + "." + this.index,
            view => view.transitionFadeIn(),
        );
    }
}

export default ProjectCardCard;