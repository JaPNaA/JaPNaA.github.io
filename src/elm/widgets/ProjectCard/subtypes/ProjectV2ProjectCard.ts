import IApp from "../../../../core/types/app/IApp";
import { V2Project } from "../../../../types/project/v2/V2Types";
import ProjectCardCard from "./ProjectCardCard";
import isCSSPropertyImage from "../../../../utils/css/isCSSPropertyImage";
import getImageSrcFromCSSProperty from "../../../../utils/css/getImageSrcFromCSSProperty";
import siteConfig from "../../../../SiteConfig";
import resolveCSSUrl from "../../../../utils/css/prependCSSUrl";
import resolveUrl from "../../../../utils/resolveUrl";

class ProjectV2ProjectCard extends ProjectCardCard<V2Project> {
    constructor(app: IApp, card: V2Project, year: number, index: number) {
        super(app, card, year, index);
    }

    protected getCardTitle(card: V2Project): string {
        return card.head.name;
    }

    protected getCardDescription(card: V2Project): string {
        return card.head.shortDescription || card.head.link ||
            (card.head.author && "by " + card.head.author[0]) ||
            "";
    }

    protected getBackgroundImage(): string | undefined {
        if (!this.card.head.background) { return; }
        for (let i = this.card.head.background.length; i >= 0; i--) {
            const bg = this.card.head.background[i];
            if (isCSSPropertyImage(bg)) {
                return bg;
            }
        }
    }

    protected getBackgroundImageSrcFromBackgroundImage(bgImage: string): string | undefined {
        const src = getImageSrcFromCSSProperty(bgImage);
        if (src) {
            return resolveUrl(src, siteConfig.path.thingy);
        }
    }

    protected setBackgroundImage(elm: HTMLElement, bgImage: string) {
        elm.style.backgroundImage = resolveCSSUrl(siteConfig.path.thingy, bgImage);
    }
}

export default ProjectV2ProjectCard;