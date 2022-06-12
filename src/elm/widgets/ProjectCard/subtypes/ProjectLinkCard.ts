import css from "../projectCard.less";

import BaseProjectCard from "../BaseProjectCard";
import IApp from "../../../../core/types/app/IApp";
import openInNewWindow from "../../../../utils/openInNewWindow";
import addZeroWidthSpacesBetweenCamelCaseWords from "../../../../utils/addZeroWidthSpacesBetweenCamelCaseWords";

class ProjectLinkCard extends BaseProjectCard {
    public width: number;
    public height: number;
    protected cardTitle: string;
    protected cardDescription: string;
    protected href: string;
    protected isContentDescriptionImportant = false;

    constructor(app: IApp, name: string, href: string) {
        super(app);
        const size = Math.ceil(Math.sqrt(name.length) * 0.5);
        this.elm.classList.add(css.link);
        this.width = size;
        this.height = size;
        this.cardTitle = addZeroWidthSpacesBetweenCamelCaseWords(name);
        this.cardDescription = href;
        this.href = href;
    }

    protected linkClickHandler(): void {
        openInNewWindow(this.href);
    }
}

export default ProjectLinkCard;