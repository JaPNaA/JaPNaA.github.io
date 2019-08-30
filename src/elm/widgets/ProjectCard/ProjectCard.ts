import isVisible from "../../../utils/isVisible";
import { Rect } from "../../../types/math/Rect";
import IRectSetable from "../../../components/dynamicGrid/types/IRectSetable";
import IApp from "../../../core/types/app/IApp";

abstract class ProjectCard implements IRectSetable {
    public abstract width: number;
    public abstract height: number;

    protected abstract cardTitle: string;
    protected abstract cardDescription: string;
    protected href?: string;

    protected app: IApp;
    protected elm: HTMLDivElement;
    protected cardElm: HTMLAnchorElement;

    private contentDescriptionElm?: HTMLDivElement;
    private contentDescriptionTextElm?: HTMLDivElement;
    private touchMovedAfterDown: boolean = false;

    constructor(app: IApp) {
        this.app = app;

        this.elm = document.createElement("div");
        this.elm.classList.add("projectCard");

        this.cardElm = document.createElement("a");
        this.cardElm.classList.add("card");
        this.elm.appendChild(this.cardElm);
    }

    public setup() {
        this.width = Math.max(2, this.width);
        this.width = Math.max(2, this.height);

        if (this.href) {
            this.cardElm.href = this.href;
        }

        const passiveOption = { passive: true };

        this.cardElm.addEventListener("mouseover", this.mouseoverHandler.bind(this));
        this.cardElm.addEventListener("mouseout", this.mouseoutHandler.bind(this));
        this.cardElm.addEventListener("touchstart", this.touchstartHandler.bind(this), passiveOption);
        this.cardElm.addEventListener("touchmove", this.touchmoveHandler.bind(this), passiveOption);
        this.cardElm.addEventListener("touchend", this.touchendHandler.bind(this), passiveOption);
        this.cardElm.addEventListener("focus", this.focusHandler.bind(this));
        this.cardElm.addEventListener("blur", this.blurHandler.bind(this));
        this.cardElm.addEventListener("click", this.clickHandler.bind(this));
    }

    public appendTo(parent: HTMLElement) {
        parent.appendChild(this.elm);
    }

    public isVisible(viewport?: Rect): boolean {
        return isVisible(this.elm, viewport);
    }

    public getDY() {
        return this.elm.getBoundingClientRect().top;
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

    protected abstract linkClickHandler(): void;

    protected clickHandler(e: MouseEvent): void {
        // What if the user exepects something else to happen while a modifier key is down?
        if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) { return; }
        e.preventDefault();
        this.linkClickHandler();
    }

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

    private touchstartHandler(e: TouchEvent): void {
        this.touchMovedAfterDown = false;
    }

    private touchmoveHandler(): void {
        this.touchMovedAfterDown = true;
    }

    private touchendHandler(e: TouchEvent): void {
        if (this.touchMovedAfterDown) { return; }
        e.preventDefault();

        if (document.activeElement === this.cardElm) {
            this.linkClickHandler();
        } else {
            this.cardElm.focus();
        }
    }

    private focusHandler(): void {
        this.mouseoverHandler();
    }

    private blurHandler(): void {
        this.mouseoutHandler();
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