import ProjectCard from "./ProjectCard";
import IApp from "../../../../core/types/app/iApp";
import openFrameView from "../../../../utils/openFrameView";

class ProjectLinkCard extends ProjectCard {
    public width: number;
    public height: number;
    protected cardTitle: string;
    protected cardDescription: string;
    private href: string;

    constructor(app: IApp, name: string, href: string) {
        super(app);
        this.width = 2;
        this.height = 2;
        this.cardTitle = name;
        this.cardDescription = href;
        this.href = href;
    }

    protected clickHandler(): void {
        openFrameView(this.app, this.href);
    }
}

export default ProjectLinkCard;