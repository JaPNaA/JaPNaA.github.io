import ProjectCard from "./ProjectCard";
import IApp from "../../../../core/types/app/IApp";
import openFrameView from "../../../../utils/openFrameView";
import addZeroWidthSpacesBetweenCamelCaseWords from "../../../../utils/addZeroWidthSpacesBetweenCamelCaseWords";

class ProjectLinkCard extends ProjectCard {
    public width: number;
    public height: number;
    protected cardTitle: string;
    protected cardDescription: string;
    protected href: string;

    constructor(app: IApp, name: string, href: string) {
        super(app);
        const size = Math.ceil(Math.sqrt(name.length) * 0.5);
        this.elm.classList.add("link");
        this.width = size;
        this.height = size;
        this.cardTitle = addZeroWidthSpacesBetweenCamelCaseWords(name);
        this.cardDescription = href;
        this.href = href;
    }

    protected linkClickHandler(): void {
        openFrameView(this.app, this.href);
    }
}

export default ProjectLinkCard;