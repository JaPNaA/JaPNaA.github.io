import IV1Card from "../../../../types/project/v1/IV1Card";
import IApp from "../../../../core/types/app/IApp";
import ProjectCardCard from "./ProjectCardCard";
import getFirstDisplayImgSrc from "../../../../components/jsonToElm/v1/getFirstDisplayImg";

class ProjectV1CardCard extends ProjectCardCard<IV1Card> {
    constructor(app: IApp, card: IV1Card, year: number, index: number) {
        super(app, card, year, index);
    }

    public load(): Promise<void> {
        this.useStyles();
        return super.load();
    }

    protected getCardTitle(card: IV1Card): string {
        return card.name;
    }
    protected getCardDescription(card: IV1Card): string {
        return card.content.description;
    }
    protected getBackgroundImage(): string | undefined {
        return getFirstDisplayImgSrc(this.card);
    }

    private useStyles() {
        if (this.card.style) {
            this.cardElm.style.cssText = this.card.style;

            if (this.cardElm.style.backgroundColor && !this.cardElm.style.color) {
                this.cardElm.classList.add("textMustBeBlack");
            }
        }
    }
}

export default ProjectV1CardCard;