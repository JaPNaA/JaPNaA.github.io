import css from "./FrameView.less";

import View from "../../../core/view/View";
import IApp from "../../../core/types/app/IApp";
import IFrame from "../../widgets/IFrame/IFrame";
import siteResources from "../../../core/siteResources";
import siteConfig from "../../../SiteConfig";
import wait from "../../../utils/wait";
import triggerTransitionIn from "../../../core/utils/triggerTransitionIn";
import AppState from "../../../core/types/AppState";

/**
 * Intended for use in own window
 */
class FrameView extends View {
    public static destoryTime = 400;
    public static transitionInTime = 400;
    public cssName = css.FrameView;
    public showMenuButton = false;
    public isFullPage = true;

    protected elm: HTMLDivElement;

    private iframe: IFrame = null as any as IFrame;
    private header: HTMLDivElement;
    private closeButton: HTMLDivElement;
    private urlElm: HTMLDivElement;

    private path?: string;

    constructor(app: IApp, state: AppState) {
        super(app, state);
        this.path = state.stateData;

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

        // POSSIBLE BUG: State not pushed
    }

    public animateTransitionIn(): void {
        triggerTransitionIn(css, this.elm, FrameView.transitionInTime);
    }

    public async setup(): Promise<void> {
        if (!this.path) { throw new Error("Path not set"); }

        await super.setup();

        // tests for iOS: prevent bug where you can't scroll in an iframe
        // Apple, fix your browser!
        if (siteConfig.isIOS) {
            location.replace(this.path);
            return;
        }

        this.iframe = new IFrame(this.path);

        this.header.classList.add(css.header);
        this.urlElm.innerText = this.path;
        this.elm.appendChild(this.header);

        this.iframe.setup();
        this.iframe.appendTo(this.elm);
        this.iframe.focus();

        // this.app.url.setState(this.viewName, this.path);
        this.addEventHandlers();
    }

    public async destory(): Promise<void> {
        await super.destory();
        this.elm.classList.add(css.destory);
        await wait(FrameView.destoryTime);
    }

    public getState(): string | undefined {
        return this.path;
    }

    private addEventHandlers() {
        this.closeButton.addEventListener("click", this.closeButtonClickHandler.bind(this));
        this.iframe.onClose(this.closeSelf.bind(this));
    }

    private createHeader(): HTMLDivElement {
        const header = document.createElement("div");
        header.classList.add(css.header);
        return header;
    }

    private createCloseButton(): HTMLDivElement {
        const closeButton = document.createElement("div");
        closeButton.classList.add(css.close);

        const img = siteResources.loadImage(siteConfig.path.img.close).data;
        closeButton.appendChild(img);

        this.header.appendChild(closeButton);
        return closeButton;
    }

    private createUrlElm(): HTMLDivElement {
        const url = document.createElement("div");
        url.classList.add(css.url);
        this.header.appendChild(url);
        return url;
    }

    private createPadRight(): HTMLDivElement {
        const padRight = document.createElement("div");
        padRight.classList.add(css.padRight);
        this.header.appendChild(padRight);
        return padRight;
    }

    private closeButtonClickHandler() {
        this.iframe.tryClose();
    }

    private closeSelf() {
        close();
    }
}

export default FrameView;