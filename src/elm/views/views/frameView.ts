import View from "../view";
import IApp from "../../../types/app";
import IFrame from "../../widgets/iframe/iframe";
import ViewMap from "../viewMap";
import SiteResources from "../../../siteResources";
import SiteConfig from "../../../siteConfig";
import wait from "../../../utils/wait";
import triggerTransitionIn from "../../../utils/triggerTransitionIn";

class FrameView extends View {
    public static destoryTime = 400;
    public static transitionInTime = 400;
    public static viewName = "FrameView";
    public viewName = FrameView.viewName;
    public showGlobalWidget = false;
    public isFullPage = true;

    protected elm: HTMLDivElement;

    private iframe: IFrame = null as any as IFrame;
    private header: HTMLDivElement;
    private closeButton: HTMLDivElement;
    private urlElm: HTMLDivElement;
    
    private path?: string;
    private redirect: boolean;

    constructor(app: IApp, path?: string) {
        super(app);
        this.path = path;
        this.redirect = true;

        this.elm = document.createElement("div");

        this.header = this.createHeader();
        this.closeButton = this.createCloseButton();
        this.urlElm = this.createUrlElm();
        this.createPadRight();
    }

    public setPath(path: string): void {
        this.path = path;
        this.urlElm.innerText = path;

        if (this.iframe) {
            this.setPath(path);
        }

        this.app.url.pushState(this.viewName, this.path);
    }

    public preventRedirection(): void {
        this.redirect = false;
    }

    public animateTransitionIn(): void {
        triggerTransitionIn(this.elm, FrameView.transitionInTime);
    }

    public async setup(): Promise<void> {
        if (!this.path) { throw new Error("Path not set"); }

        await super.setup();

        if (this.redirect) {
            location.replace(this.path);
            return;
        }

        this.iframe = new IFrame(this.path);

        this.header.classList.add("header");
        this.urlElm.innerText = this.path;
        this.elm.appendChild(this.header);

        this.iframe.setup();
        this.iframe.appendTo(this.elm);
        this.iframe.focus();

        this.app.url.setState(this.viewName, this.path);
        this.addEventHandlers();
    }

    public async destory(): Promise<void> {
        await super.destory();
        await wait(FrameView.destoryTime);
    }

    private addEventHandlers() {
        this.closeButton.addEventListener("click", this.closeButtonClickHandler.bind(this));
        this.iframe.onClose(this.closeSelf.bind(this));
    }

    private createHeader(): HTMLDivElement {
        const header = document.createElement("div");
        header.classList.add("header");
        return header;
    }

    private createCloseButton(): HTMLDivElement {
        const closeButton = document.createElement("div");
        closeButton.classList.add("close");

        const img = SiteResources.loadImage(SiteConfig.path.img.close).image;
        closeButton.appendChild(img);

        this.header.appendChild(closeButton);
        return closeButton;
    }

    private createUrlElm(): HTMLDivElement {
        const url = document.createElement("div");
        url.classList.add("url");
        this.header.appendChild(url);
        return url;
    }

    private createPadRight(): HTMLDivElement {
        const padRight = document.createElement("div");
        padRight.classList.add("padRight");
        this.header.appendChild(padRight);
        return padRight;
    }

    private closeButtonClickHandler() {
        this.iframe.tryClose();
    }

    private closeSelf() {
        this.app.closeView(this);
    }
}

ViewMap.add(FrameView);

export default FrameView;