import "../../../../styles/components/cardV2.less";

import Widget from "../../../core/widget/Widget";
import { V2Project } from "../../../types/project/v2/V2Types";
import WidgetMap from "../../../core/widget/WidgetMap";
import IApp from "../../../core/types/app/IApp";
import ContentMan from "../../contentMan/contentMan";
import HexagonsCorner from "./hexagons/HexagonsCorner";
import parseV2ProjectBodyElements from "./parseV2ProjectBodyElements";
import isCSSPropertyImage from "../../../utils/css/isCSSPropertyImage";
import siteConfig from "../../../SiteConfig";
import getHueFromRGB from "../../../utils/color/getHueFromRGB";
import extractRGBFromCSSrgbFunction from "../../../utils/color/extractRGBFromCSSrgbFunction";
import isRGBColorDark from "../../../utils/color/isRGBColorDark";
import darkenRGB from "../../../utils/color/darkenRGB";
import rgbToString from "../../../utils/color/toRGBString";
import prependCSSUrl from "../../../utils/css/prependCSSUrl";

class ProjectJSONv2Elm extends Widget {
    public static widgetName = "projectJSONv2Elm";
    public widgetName = ProjectJSONv2Elm.widgetName;
    protected elm: HTMLDivElement;

    private project: V2Project;
    private app: IApp;

    private backgroundContainer: HTMLDivElement;
    private contentContainer: HTMLDivElement;
    private mainContent: HTMLDivElement;
    private title: HTMLHeadingElement;
    private body: HTMLDivElement;
    private hexagons: HexagonsCorner;

    private hue: number;

    constructor(app: IApp, project: V2Project) {
        super();
        this.app = app;
        this.project = project;
        this.elm = document.createElement("div");

        this.backgroundContainer = this.createBackground();
        this.contentContainer = this.createContentContainer();
        this.mainContent = this.createMainContent();
        this.title = this.createTitle(project.head.name);
        this.body = this.createBody();
        this.hue = siteConfig.hexagonBaseHue;

        this.applyStyles();

        this.hexagons = new HexagonsCorner(app, this.hue);

        // todo: this.project.head.author
        // todo: this.project.head.no
        // todo: this.project.head.tags
        // todo: this.project.head.timestamp
        // todo: this.project.head.accentColor
    }

    public canScroll(): boolean {
        return this.backgroundContainer.clientHeight > this.elm.clientHeight;
    }

    public setup(): void {
        super.setup();
        this.loadBody();

        this.elm.appendChild(this.backgroundContainer);
        this.hexagons.appendTo(this.backgroundContainer);
        this.backgroundContainer.appendChild(this.contentContainer);
        this.contentContainer.appendChild(this.mainContent);
        this.mainContent.appendChild(this.title);
        this.mainContent.appendChild(this.body);

        this.addEventHandlers();
    }

    private addEventHandlers(): void {
        this.elm.addEventListener("scroll", this.scrollHandler.bind(this));

        this.setupScrollHandler();
    }

    private setupScrollHandler() {
        this.body.classList.add("hidden");
    }

    private createBackground(): HTMLDivElement {
        const background = document.createElement("div");
        background.classList.add("background");
        return background;
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

    private createTitle(text: string): HTMLHeadingElement {
        const title = document.createElement("h1");
        title.classList.add("title");
        title.innerText = text;
        return title;
    }

    private createBody(): HTMLDivElement {
        const body = document.createElement("div");
        body.classList.add("body");
        return body;
    }

    private async loadBody(): Promise<void> {
        const body = await ContentMan.getV2CardBody(this.project);
        this.body.appendChild(parseV2ProjectBodyElements(body));
    }

    private applyStyles(): void {
        if (this.project.head.background) {
            // loop backwards, so the first properties that work stays
            for (let i = this.project.head.background.length - 1; i >= 0; i--) {
                const background = this.project.head.background[i];
                if (isCSSPropertyImage(background)) {
                    this.backgroundContainer.style.backgroundImage =
                        prependCSSUrl(siteConfig.path.thingy, background);
                } else {
                    this.backgroundContainer.style.backgroundColor = background;
                }
            }
        }

        if (this.project.head.textColor) {
            this.elm.style.color = this.project.head.textColor;
        }

        if (this.project.head.accentColor) {
            this.applyAccentColor(this.project.head.accentColor);
        }
    }

    private applyAccentColor(accentColor: string) {
        this.title.style.color = accentColor;

        if (this.title.style.color) {
            const [r, g, b] = extractRGBFromCSSrgbFunction(this.title.style.color);
            if (isRGBColorDark(r, g, b)) {
                const darkened = darkenRGB(r, g, b, 0.3);
                this.title.style.textShadow = "none";
                this.title.style.color = rgbToString(darkened[0], darkened[1], darkened[2]);
            } else {
                // very hard to pull off tinted white text
                this.title.style.color = "#ffffff";
            }

            this.hue = getHueFromRGB(r, g, b) || this.hue;
        }
    }

    private scrollHandler(): void {
        if (this.elm.scrollTop <= 0) {
            this.body.classList.add("hidden");
        } else {
            this.body.classList.remove("hidden");
        }
    }
}

WidgetMap.add(ProjectJSONv2Elm);

export default ProjectJSONv2Elm;