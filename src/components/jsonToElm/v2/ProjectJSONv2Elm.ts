import "./cardV2.less";

import { V2Project } from "../../../types/project/v2/V2Types";
import applyV2ProjectBackground from "../../../utils/v2Project/applyV2ProjectBackground";
import ContentMan from "../../contentMan/contentMan";
import darkenRGB from "../../../utils/color/darkenRGB";
import extractRGBFromCSSrgbFunction from "../../../utils/color/extractRGBFromCSSrgbFunction";
import getHueFromRGB from "../../../utils/color/getHueFromRGB";
import HexagonsCorner from "./hexagons/HexagonsCorner";
import IApp from "../../../core/types/app/IApp";
import isRGBColorDark from "../../../utils/color/isRGBColorDark";
import parseV2ProjectBodyElements from "./parseV2ProjectBodyElements";
import rgbToString from "../../../utils/color/toRGBString";
import Widget from "../../../core/widget/Widget";
import openImageView from "../../../utils/view/openImageView";
import Hexagon from "../../hexagons/Hexagon";
import siteConfig from "../../../SiteConfig";
import ISavableScroll from "../../viewPrivateData/saveScroll/ISaveScrollable";
import resolveUrl from "../../../utils/resolveUrl";

class ProjectJSONv2Elm extends Widget implements ISavableScroll {
    public static cssName = "projectJSONv2Elm";
    public cssName = ProjectJSONv2Elm.cssName;

    public scrollingElm: HTMLElement;
    protected elm: HTMLDivElement;

    private project: V2Project;
    private app: IApp;

    private background: HTMLDivElement;
    private hexagons: HexagonsCorner;
    private hexagonsContainer: HTMLDivElement;
    private backgroundImageContainer: HTMLDivElement;
    private backgroundImage: HTMLDivElement;

    private headContainer: HTMLDivElement;
    private head: HTMLDivElement;
    private title: HTMLHeadingElement;
    private bigViewProjectButton: HTMLAnchorElement;

    private scrollIndicator: HTMLDivElement;

    private contentContainer: HTMLDivElement;
    private mainContent: HTMLDivElement;
    private body: HTMLDivElement;


    private hue: number;

    constructor(app: IApp, project: V2Project) {
        super();
        this.app = app;
        this.project = project;
        this.scrollingElm = this.elm = document.createElement("div");

        this.background = this.createBackground();
        this.hexagonsContainer = this.createHexagonsContainer();
        this.backgroundImage = this.createBackgroundImage();
        this.backgroundImageContainer = this.createBackgroundImageContainer();

        this.headContainer = this.createHeadContainer();
        this.head = this.createHead();
        this.title = this.createTitle(project.head.name);
        this.bigViewProjectButton = this.createBigViewProjectButton();
        this.scrollIndicator = this.createScrollIndicator();

        this.contentContainer = this.createContentContainer();
        this.mainContent = this.createMainContent();
        this.body = this.createBody();

        this.hue = Hexagon.baseHue;

        this.applyStyles();

        this.hexagons = new HexagonsCorner(app, this.elm, this.hue);

        // todo: this.project.head.author
        // todo: this.project.head.no
        // todo: this.project.head.tags
        // todo: this.project.head.timestamp
        // todo: this.project.head.accentColor
    }

    public canScroll(): boolean {
        return this.background.clientHeight > this.elm.clientHeight;
    }

    public getTitle(): string {
        return this.project.head.name;
    }

    public setup(): void {
        super.setup();
        this.loadBody();

        this.elm.appendChild(this.background);
        this.background.appendChild(this.backgroundImageContainer);
        this.backgroundImageContainer.appendChild(this.backgroundImage);
        this.background.appendChild(this.hexagonsContainer);
        this.hexagons.appendTo(this.hexagonsContainer);

        this.head.appendChild(this.title);
        this.head.appendChild(this.bigViewProjectButton);
        this.headContainer.appendChild(this.head);
        this.headContainer.appendChild(this.scrollIndicator);
        this.mainContent.appendChild(this.headContainer);
        this.mainContent.appendChild(this.body);

        this.contentContainer.appendChild(this.mainContent);
        this.background.appendChild(this.contentContainer);

        this.hexagons.setup();

        this.addEventHandlers();
    }

    public destory() {
        super.destory();
        this.hexagons.destory();
        this.app.events.offResize(this.resizeHandler);
    }

    private addEventHandlers(): void {
        this.elm.addEventListener("scroll", this.scrollHandler.bind(this));
        this.elm.addEventListener("click", this.clickHandler.bind(this));

        this.resizeHandler = this.resizeHandler.bind(this);
        this.app.events.onResize(this.resizeHandler);

        this.resizeHandler();
    }

    private createBackground(): HTMLDivElement {
        const background = document.createElement("div");
        background.classList.add("background");
        return background;
    }

    private createHexagonsContainer(): HTMLDivElement {
        const hexagonsContainer = document.createElement("div");
        hexagonsContainer.classList.add("hexagonsContainer");
        return hexagonsContainer;
    }

    private createBackgroundImage(): HTMLDivElement {
        const backgroundImage = document.createElement("div");
        backgroundImage.classList.add("backgroundImage");
        return backgroundImage;
    }

    private createBackgroundImageContainer(): HTMLDivElement {
        const backgroundImageContainer = document.createElement("div");
        backgroundImageContainer.classList.add("backgroundImageContainer");
        return backgroundImageContainer;
    }

    private createHeadContainer(): HTMLDivElement {
        const headContainer = document.createElement("div");
        headContainer.classList.add("headContainer");
        return headContainer;
    }

    private createHead(): HTMLDivElement {
        const head = document.createElement("div");
        head.classList.add("head");
        return head;
    }

    private createTitle(text: string): HTMLHeadingElement {
        const title = document.createElement("h1");
        title.classList.add("title");
        title.innerText = text;
        return title;
    }

    private createBigViewProjectButton(): HTMLAnchorElement {
        const button = document.createElement("a");
        button.innerText = "Open Project";
        button.classList.add("bigViewProjectButton");

        if (this.project.head.link) {
            button.href = resolveUrl(this.project.head.link, siteConfig.path.thingy);
        } else {
            button.classList.add("hidden");
        }

        return button;
    }

    private createScrollIndicator(): HTMLDivElement {
        const scrollIndiciator = document.createElement("img");
        scrollIndiciator.classList.add("scrollIndicator");
        scrollIndiciator.src = siteConfig.path.img.upArrow;


        const scrollIndicatorContainer = document.createElement("div");
        scrollIndicatorContainer.appendChild(scrollIndiciator);
        scrollIndicatorContainer.classList.add("scrollIndicatorContainer");

        return scrollIndicatorContainer;
    }

    private createContentContainer(): HTMLDivElement {
        const container = document.createElement("div");
        container.classList.add("contentContainer");
        return container;
    }

    private createMainContent(): HTMLDivElement {
        const main = document.createElement("div");
        main.classList.add("mainContent");
        return main;
    }

    private createBody(): HTMLDivElement {
        const body = document.createElement("div");
        body.classList.add("body");
        body.setAttribute("role", "main");
        body.setAttribute("aria-hidden", "false");
        return body;
    }

    private async loadBody(): Promise<void> {
        const body = await ContentMan.getV2CardBody(this.project);
        this.body.appendChild(parseV2ProjectBodyElements(body));
    }

    private applyStyles(): void {
        applyV2ProjectBackground(this.project, this.backgroundImage);

        if (this.project.head.textColor) {
            this.elm.style.color = this.project.head.textColor;
        }

        if (this.project.head.accentColor) {
            this.applyAccentColor(this.project.head.accentColor);
        }
    }

    private applyAccentColor(accentColor: string) {
        this.title.style.color = accentColor;
        const formattedColor = this.title.style.color;

        if (formattedColor) {
            const [r, g, b] = extractRGBFromCSSrgbFunction(formattedColor);
            if (isRGBColorDark(r, g, b)) {
                const darkened = darkenRGB(r, g, b, 0.3);
                this.title.style.textShadow = "none";
                this.title.style.color = rgbToString(darkened[0], darkened[1], darkened[2]);
                this.title.style.backgroundColor = "transparent";
            } else {
                // very hard to pull off tinted white text
                this.title.style.color = "#ffffff";
            }

            this.hue = getHueFromRGB(r, g, b) || this.hue;

            this.background.style.backgroundColor = formattedColor;
        }
    }

    private scrollHandler(): void {
        if (!siteConfig.isMobile) {
            this.backgroundImage.style.transform = "translateY(" + (this.elm.scrollTop / 2) + "px)";
        }
    }

    private resizeHandler(): void {
        this.backgroundImageContainer.style.height = this.app.height + "px";
    }

    private async clickHandler(e: MouseEvent): Promise<void> {
        if (e.target instanceof HTMLImageElement) {
            openImageView(this.app, e.target);
        }
    }
}

export default ProjectJSONv2Elm;