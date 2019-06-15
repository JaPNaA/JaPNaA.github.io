import ICard from "../../../types/project/card";
import isVisible from "../../../utils/isVisible";
import { Rect } from "../../../types/math/rect";
import IRectSetable from "../../../components/dynamicGrid/types/IRectSetable";
import random from "../../../utils/random";
import IApp from "../../../core/types/app/iApp";
import getFirstDisplayImgSrc from "../../../components/jsonToElm/v1/getFirstDisplayImg";
import SiteResources from "../../../core/siteResources";
import SiteConfig from "../../../siteConfig";

class ProjectCard implements IRectSetable {
    public width: number;
    public height: number;

    private app: IApp;
    private card: ICard;
    private elm: HTMLDivElement;
    private cardElm: HTMLDivElement;

    constructor(app: IApp, card: ICard) {
        this.app = app;
        this.card = card;

        this.elm = document.createElement("div");
        this.elm.classList.add("projectCard");

        this.cardElm = document.createElement("div");
        this.cardElm.classList.add("card");
        this.elm.appendChild(this.cardElm);

        this.width = random(3, 4, 1);
        this.height = 6;
    }

    public appendTo(parent: HTMLElement) {
        parent.appendChild(this.elm);
    }

    public isVisible(): boolean {
        return isVisible(this.elm);
    }

    public setRect(rect: Rect): void {
        this.elm.style.top = rect.y + "px";
        this.elm.style.left = rect.x + "%";
        this.elm.style.width = rect.width + "%";
        this.elm.style.height = rect.height + "px";
    }

    /**
     * Loads assets
     */
    public async load(): Promise<void> {
        this.useStyles();
        this.addBackground();
        this.addContent();
    }

    private useStyles() {
        if (this.card.style) {
            this.cardElm.style.cssText = this.card.style;
        }
    }

    private addBackground() {
        const firstDisplay = getFirstDisplayImgSrc(this.card);
        if (!firstDisplay) { return; }
        const path = SiteConfig.path.thingy + firstDisplay;
        SiteResources.loadImage(path);
        this.cardElm.style.backgroundImage = "url(" + path + ")";
    }

    private addContent() {
        const content = document.createElement("div");
        content.appendChild(this.createContentBackground());
        content.appendChild(this.createContentTitle());
        content.appendChild(this.createContentDescription());
        this.cardElm.appendChild(content);
    }

    private createContentBackground() {
        const background = document.createElement("div");
        background.classList.add("background");
        // same background color as cardElm
        background.style.backgroundColor = getComputedStyle(this.cardElm).backgroundColor;
        return background;
    }

    private createContentTitle() {
        const title = document.createElement("div");
        title.classList.add("title");
        title.innerText = this.card.name;
        return title;
    }

    private createContentDescription() {
        const description = document.createElement("desc");
        description.classList.add("description");
        description.innerHTML = this.card.content.description;
        return description;
    }
}

export default ProjectCard;