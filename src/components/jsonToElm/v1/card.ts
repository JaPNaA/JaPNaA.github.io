import "../../../../styles/components/cardV1.less";

import ICard from "../../../types/project/card";
import SiteConfig from "../../../siteConfig";
import Display from "../../../types/project/display";
import DisplayImg from "../../../types/project/displayImg";
import triggerTransitionIn from "../../../core/utils/triggerTransitionIn";
import SiteResources from "../../../core/siteResources";
import IApp from "../../../core/types/app/iApp";
import IImageView from "../../../elm/views/imageview/iImageView";
import getFirstDisplayImgSrc from "./getFirstDisplayImg";

// TODO: refactor, along with it's .less companion!

class CardJSONv1Elm {
    private static transitionInTimeout: number = 3000;

    public viewProjectButton: HTMLAnchorElement = null as unknown as HTMLAnchorElement;

    private app: IApp;
    private elm: HTMLDivElement;
    private card: ICard;
    private backgroundImageExists: boolean;

    private container: HTMLDivElement = null as unknown as HTMLDivElement;

    public constructor(app: IApp, card: ICard) {
        this.app = app;
        this.card = card;
        this.elm = document.createElement("div");
        this.backgroundImageExists = false;
    }

    public setup() {
        this.resizeHandler = this.resizeHandler.bind(this);
        this.app.events.onResize(this.resizeHandler);
        this.parse();
        this.resizeHandler();
    }

    public destory() {
        this.app.events.offResize(this.resizeHandler);
    }

    public appendTo(parent: HTMLElement): void {
        parent.append(this.elm);
    }

    public animateTransitionIn(): void {
        triggerTransitionIn(this.elm, CardJSONv1Elm.transitionInTimeout);
    }

    public addEventListeners(): void {
        // TODO: when image clicked, pop out, show
    }

    private parse(): void {
        this.elm.classList.add("card", "v1");

        this.container = this.createBackgroundContainer();
        this.createInformationBlock();
    }

    private createBackgroundContainer(): HTMLDivElement {
        const bgImage = this.createBackgroundImage();
        const bgGradient = this.createBackgroundGradient();
        bgImage.appendChild(bgGradient);
        this.elm.appendChild(bgImage);
        return bgGradient;
    }

    private createBackgroundImage(): HTMLDivElement {
        const background = document.createElement("div");
        background.classList.add("background");

        if (this.card.style) {
            background.style.cssText = this.card.style;
        }

        const src = getFirstDisplayImgSrc(this.card);

        if (src) {
            background.style.backgroundImage = `url(${SiteConfig.path.thingy}${src})`;
            this.elm.classList.add("backgroundImageExists");
            this.backgroundImageExists = true;
        }

        return background;
    }

    private createBackgroundGradient(): HTMLDivElement {
        const gradient = document.createElement("div");
        gradient.classList.add("backgroundGradient");
        return gradient;
    }

    private createInformationBlock(): void {
        // TODO: jsformat
        const block = document.createElement("div");
        block.classList.add("infoBlock");

        if (!this.backgroundImageExists && this.card.style) {
            block.style.cssText = this.card.style;
        }

        this.createNameIn(block);
        this.createNoIn(block);
        this.createTagsIn(block);
        this.createAuthorIn(block);
        this.createDescriptionIn(block);
        this.createDisplaysIn(block);
        this.createLinkIn(block);
        this.createTimestampIn(block);

        this.container.appendChild(block);
    }

    private createNameIn(block: HTMLElement): void {
        const name = document.createElement("h1");
        name.classList.add("name");
        name.innerText = this.card.name;
        block.appendChild(name);
    }

    private createNoIn(block: HTMLElement): void {
        const no = document.createElement("span");
        no.innerText = this.card.no.toString();
        no.classList.add("no");
        block.appendChild(no);
    }

    private createTagsIn(block: HTMLElement): void {
        const tagsElm = document.createElement("ul");
        tagsElm.classList.add("tags");

        for (const tag of this.card.tags) {
            const tagElm = document.createElement("li");
            tagElm.innerText = tag;
            tagsElm.appendChild(tagElm);
        }

        block.appendChild(tagsElm);
    }

    private createAuthorIn(block: HTMLElement): void {
        const author = document.createElement("div");
        author.classList.add("author");
        author.innerText = this.card.author.join(", ");
        block.appendChild(author);
    }

    private createDescriptionIn(block: HTMLElement): void {
        const description = document.createElement("div");
        description.classList.add("description");
        description.innerHTML = this.card.content.description;
        block.appendChild(description);
    }

    private createDisplaysIn(block: HTMLElement): void {
        // TODO: slice(1) instead
        const displays = this.card.content.display.slice(0);
        for (const display of displays) {
            this.createDisplayIn(display, block);
        }
    }

    private createDisplayIn(display: Display, block: HTMLElement): void {
        const displayElm = document.createElement("div");
        displayElm.classList.add("display");

        this.createDisplayTypeIn(displayElm, display);

        block.appendChild(displayElm);
    }

    private createDisplayTypeIn(parent: HTMLElement, display: Display): void {
        if (display.type === "img") {
            this.createDisplayImgIn(parent, display);
        } else if (display.type === "iframe") {
            this.createDisplayTypeIn(parent, display.alt);
        }
    }

    private createDisplayImgIn(parent: HTMLElement, display: DisplayImg): void {
        if (display.src) {
            // POSSIBLE BUG: For all SiteConfig.thingyLink + ..., link could be absolute
            const src = SiteConfig.path.thingy + display.src;
            const img = SiteResources.loadImage(src).copyImage();
            img.classList.add("img");
            this.addImageClickHandler(img);
            parent.appendChild(img);
        }

        if (display.caption) {
            const caption = document.createElement("small");
            caption.innerText = display.caption;
            caption.classList.add("caption");
            parent.appendChild(caption);
        }
    }

    private createLinkIn(block: HTMLElement): void {
        const link = document.createElement("a");
        link.classList.add("link");
        link.href = SiteConfig.path.thingy + this.card.content.link;
        block.appendChild(link);
        this.viewProjectButton = link;
    }

    private createTimestampIn(block: HTMLElement): void {
        if (!this.card.timestamp) { return; }

        const time = document.createElement("div");
        time.classList.add("timestamp");
        time.innerText = new Date(this.card.timestamp).toLocaleDateString();
        block.appendChild(time);
    }

    private resizeHandler(): void {
        this.container.style.minHeight = this.app.height + "px";
    }

    private addImageClickHandler(image: HTMLImageElement): void {
        image.addEventListener("click", async () => {
            const imageView = await this.app.top().views.open("ImageView") as IImageView;
            const bbox = image.getBoundingClientRect();

            imageView.setInitalTransform(bbox.left, bbox.top, bbox.width / image.naturalWidth);
            imageView.setImageSrc(image.src);
            imageView.transitionIn();
        });
    }
}

export default CardJSONv1Elm;