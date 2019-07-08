import IApp from "../../../../core/types/app/IApp";
import { V2Project } from "../../../../types/project/v2/V2Types";
import ProjectCardCard from "./ProjectCardCard";

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
        for (const bg of this.card.head.background) {
            const match = bg.match(/^url\((.+)\)$/);
            if (match) {
                return match[1];
            }
        }
    }
}

export default ProjectV2ProjectCard;