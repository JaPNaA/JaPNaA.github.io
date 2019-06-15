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

    private year: number;
    private index: number;

    private contentDescriptionElm?: HTMLDivElement;
    private contentDescriptionTextElm?: HTMLDivElement;

    constructor(app: IApp, card: ICard, year: number, index: number) {
        this.app = app;
        this.card = card;

        this.elm = document.createElement("div");
        this.elm.classList.add("projectCard");

        this.cardElm = document.createElement("div");
        this.cardElm.classList.add("card");
        this.elm.appendChild(this.cardElm);

        this.year = year;
        this.index = index;

        this.width = random(3, 4, 1);
        this.height = random(5, 7, 1);
    }

    public setup() {
        this.cardElm.addEventListener("mouseover", this.mouseoverHandler.bind(this));
        this.cardElm.addEventListener("mouseout", this.mouseoutHandler.bind(this));
        this.cardElm.addEventListener("click", this.clickHandler.bind(this));
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

    private addBackground(): void {
        const firstDisplay = getFirstDisplayImgSrc(this.card);
        if (!firstDisplay) { return; }
        const path = SiteConfig.path.thingy + firstDisplay;
        SiteResources.loadImage(path);

        const background = document.createElement("div");
        background.classList.add("background");
        background.style.backgroundImage = "url(" + path + ")";
        this.cardElm.appendChild(background);
    }

    private addContent(): void {
        const content = document.createElement("div");
        content.appendChild(this.createContentBackgroundOverlay());
        content.appendChild(this.createTextContainer());
        this.cardElm.appendChild(content);
    }

    private createContentBackgroundOverlay(): HTMLDivElement {
        const background = document.createElement("div");
        background.classList.add("backgroundOverlay");
        // same background color as cardElm
        if (this.cardElm.style.backgroundColor) {
            background.style.backgroundColor = this.cardElm.style.backgroundColor;
        }
        return background;
    }

    private createTextContainer(): HTMLDivElement {
        const container = document.createElement("div");
        container.classList.add("textContainer");
        container.appendChild(this.createContentTitle());
        container.appendChild(this.createContentDescription());
        return container;
    }

    private createContentTitle(): HTMLDivElement {
        const title = document.createElement("div");
        title.classList.add("title");
        title.innerText = this.card.name;
        return title;
    }

    private createContentDescription(): HTMLDivElement {
        const description = document.createElement("div");
        description.classList.add("description");
        this.contentDescriptionElm = description;

        const text = document.createElement("div");
        text.innerHTML = this.card.content.description;
        this.contentDescriptionTextElm = text;

        description.appendChild(text);
        return description;
    }

    private mouseoverHandler(): void {
        this.cardElm.classList.add("mouseover");
        if (this.contentDescriptionElm && this.contentDescriptionTextElm) {
            this.contentDescriptionElm.style.height =
                this.contentDescriptionTextElm.getBoundingClientRect().height + "px";
        }
    }

    private mouseoutHandler(): void {
        this.cardElm.classList.remove("mouseover");
        if (this.contentDescriptionElm) {
            this.contentDescriptionElm.style.height = "0";
        }
    }

    private clickHandler(): void {
        // TODO: Animate expanding instead of just switching views
        this.app.views.switchAndInit("ProjectInfo", this.year + "." + this.index);
    }
}

export default ProjectCard;