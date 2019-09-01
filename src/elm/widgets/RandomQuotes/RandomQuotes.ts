import "../../../../styles/widgets/randomQuotes.less";

import Widget from "../../../core/widget/Widget";
import WidgetMap from "../../../core/widget/WidgetMap";
import IApp from "../../../core/types/app/IApp";
import siteConfig from "../../../SiteConfig";
import openImageView from "../../../utils/view/openImageView";

class RandomQuotes extends Widget {
    public static widgetName = "randomQuotes";
    public widgetName = RandomQuotes.widgetName;

    private app: IApp;
    private childrenArg: Element[];
    protected elm: HTMLDivElement;

    private readonly imageContainer: HTMLDivElement;
    private readonly imageElm?: HTMLImageElement;
    private readonly quoteContainer: HTMLDivElement;
    private readonly quoteElm: HTMLDivElement;

    private quotes: string[];

    constructor(app: IApp, children: Element[]) {
        super();
        this.app = app;
        this.childrenArg = children;
        this.elm = document.createElement("div");

        this.imageContainer = this.createImageContainer();
        this.imageElm = this.getImageFromChildren();
        this.quotes = this.getQuotesFromChildren();
        this.quoteContainer = this.createQuoteContainer();
        this.quoteElm = this.createQuoteElm();
    }

    public setup(): void {
        super.setup();

        if (this.imageElm) {
            this.elm.classList.add("hasImage");
            this.imageContainer.appendChild(this.imageElm);
            this.elm.appendChild(this.imageContainer);
        }

        this.quoteContainer.appendChild(this.quoteElm);
        this.elm.appendChild(this.quoteContainer);

        this.addEventHandlers();
    }

    public destory(): void {
        super.destory();
        this.removeEventHandlers();
    }

    private addEventHandlers(): void {
        this.resizeHandler = this.resizeHandler.bind(this);
        this.app.events.onResize(this.resizeHandler);
        this.resizeHandler();

        if (this.imageElm) {
            this.imageElm.addEventListener("click", this.imageClickHandler.bind(this));
        }
    }

    private removeEventHandlers(): void {
        this.app.events.offResize(this.resizeHandler);
    }

    private getImageFromChildren(): HTMLImageElement | undefined {
        for (const elm of this.childrenArg) {
            if (elm.tagName === "IMG") {
                return elm as HTMLImageElement;
            }
        }
    }

    private getQuotesFromChildren(): string[] {
        const quotes: string[] = [];

        for (const elm of this.childrenArg) {
            if (elm.tagName === "QUOTES") {
                for (let i = 0, length = elm.children.length; i < length; i++) {
                    const child = elm.children[i];
                    if (child.tagName === "QUOTE") {
                        quotes.push(child.innerHTML);
                    } else {
                        console.warn("Unexpected <" + child.tagName.toLowerCase() + "> in <quotes>");
                    }
                }
            }
        }

        return quotes;
    }

    private createImageContainer(): HTMLDivElement {
        const container = document.createElement("div");
        container.classList.add("imageContainer");
        return container;
    }

    private createQuoteContainer(): HTMLDivElement {
        const container = document.createElement("div");
        container.classList.add("quoteContainer");
        return container;
    }

    private createQuoteElm(): HTMLDivElement {
        const quotes = document.createElement("div");
        quotes.classList.add("quote");
        quotes.innerHTML = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        return quotes;
    }

    private resizeHandler(): void {
        if (this.app.width > siteConfig.cssVars.longTextContainerMaxWidth) {
            this.quoteElm.classList.add("fixFontSize");
        } else {
            this.quoteElm.classList.remove("fixFontSize");
        }
    }

    private async imageClickHandler(): Promise<void> {
        openImageView(this.app, this.imageElm!);
    }
}

WidgetMap.add(RandomQuotes);

export default RandomQuotes;