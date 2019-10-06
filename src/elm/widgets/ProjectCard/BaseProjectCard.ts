import IApp from "../../../core/types/app/IApp";
import keyIsModified from "../../../utils/keyIsModified";

abstract class BaseProjectCard {
    public static widgetName = "projectCard";
    public widgetName = BaseProjectCard.widgetName;

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

    private focused: boolean = false;
    private mouseover: boolean = false;

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
        this.cardElm.addEventListener("touchend", this.touchendHandler.bind(this));
        this.cardElm.addEventListener("focus", this.focusHandler.bind(this));
        this.cardElm.addEventListener("blur", this.blurHandler.bind(this));
        this.cardElm.addEventListener("click", this.clickHandler.bind(this));
    }

    public appendTo(parent: HTMLElement): void {
        parent.appendChild(this.elm);
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
        if (keyIsModified(e)) { return; }
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
        const title = document.createElement("h2");
        title.classList.add("title");
        title.innerText = this.cardTitle;
        return title;
    }

    private createContentDescription(): HTMLDivElement {
        const description = document.createElement("div");
        description.classList.add("description");
        this.contentDescriptionElm = description;

        const text = document.createElement("p");
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
        this.focused = true;
        this.updateMouseoverStyleState();
    }

    private blurHandler(): void {
        this.focused = false;
        this.updateMouseoverStyleState();
    }

    private mouseoverHandler(): void {
        this.mouseover = true;
        this.updateMouseoverStyleState();
    }

    private mouseoutHandler(): void {
        this.mouseover = false;
        this.updateMouseoverStyleState();
    }

    private updateMouseoverStyleState(): void {
        if (this.focused || this.mouseover) {
            this.addMouseoverStyles();
        } else {
            this.removeMouseoverStyles();
        }
    }

    private addMouseoverStyles(): void {
        this.cardElm.classList.add("mouseover");
        if (this.contentDescriptionElm && this.contentDescriptionTextElm) {
            this.contentDescriptionElm.style.height =
                this.contentDescriptionTextElm.getBoundingClientRect().height + "px";
        }
    }

    private removeMouseoverStyles(): void {
        this.cardElm.classList.remove("mouseover");
        if (this.contentDescriptionElm) {
            this.contentDescriptionElm.style.height = "0";
        }
    }
}

export default BaseProjectCard;