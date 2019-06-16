import isVisible from "../../../../utils/isVisible";
import { Rect } from "../../../../types/math/rect";
import IRectSetable from "../../../../components/dynamicGrid/types/IRectSetable";
import IApp from "../../../../core/types/app/iApp";

abstract class ProjectCard implements IRectSetable {
    public abstract width: number;
    public abstract height: number;

    protected abstract cardTitle: string;
    protected abstract cardDescription: string;

    protected app: IApp;
    protected elm: HTMLDivElement;
    protected cardElm: HTMLDivElement;

    private contentDescriptionElm?: HTMLDivElement;
    private contentDescriptionTextElm?: HTMLDivElement;

    constructor(app: IApp) {
        this.app = app;

        this.elm = document.createElement("div");
        this.elm.classList.add("projectCard");

        this.cardElm = document.createElement("div");
        this.cardElm.classList.add("card");
        this.elm.appendChild(this.cardElm);
    }

    public setup() {
        this.width = Math.max(2, this.width);
        this.width = Math.max(2, this.height);
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
        this.cardElm.appendChild(this.createBackground());
        this.addContent();
    }

    protected abstract clickHandler(): void;

    protected createBackground(): HTMLDivElement {
        const background = document.createElement("div");
        background.classList.add("background");
        background.style.backgroundColor = "transparent";
        return background;
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
        title.innerText = this.cardTitle;
        return title;
    }

    private createContentDescription(): HTMLDivElement {
        const description = document.createElement("div");
        description.classList.add("description");
        this.contentDescriptionElm = description;

        const text = document.createElement("div");
        text.innerHTML = this.cardDescription;
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
}

export default ProjectCard;