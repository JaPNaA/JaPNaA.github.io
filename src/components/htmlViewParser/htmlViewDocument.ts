import SiteConfig from "../../siteConfig";
import IApp from "../../core/types/app/iApp";
import ViewMap from "../../core/view/viewMap";
import EmbededApp from "../../core/app/embededApp";
import ViewClass from "../../core/types/view/viewClass";
import WidgetMap from "../../core/widget/widgetMap";
import WidgetClass from "../../core/types/widgetClass";
import IHTMLViewDocument from "./iHTMLViewDocument";
import LinkHandlingOptions from "./types/linkHandlingOptions";
import url from "url";
import parseAppStateURL from "../../core/utils/parseAppStateURL";
import openNoopener from "../../core/utils/open/openNoopener";
import openFrameView from "../../utils/openFrameView";
import createViewState from "../../core/utils/createViewState";
import ViewClassGhost from "../../core/view/viewClassGhost";


class HTMLViewDocument implements IHTMLViewDocument {
    public hasErrors: boolean;

    private elm: HTMLDivElement;
    private app: IApp;
    private linkHandlingOptions?: LinkHandlingOptions;

    constructor(app: IApp, text: string) {
        this.app = app;
        this.hasErrors = false;

        this.elm = this.parseHTML(text);
        this.elm.classList.add("html-parsed");
    }

    public appendTo(parent: Element): void {
        parent.appendChild(this.elm);
    }

    public runScripts(): void {
        const scripts = this.elm.getElementsByTagName("script");
        const idElementMap = this.getElementIdMap();

        for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i];
            try {
                const func = new Function("div", "id", "SiteConfig", script.innerHTML);
                func(this.elm, idElementMap, SiteConfig);
            } catch (err) {
                console.error(err);
                this.hasErrors = true;
            }
        }

        if (this.hasErrors) {
            this.createScriptErrorWarning();
        }
    }

    public replaceElements(): void {
        this.replaceViewElements();
        this.replaceWidgetElements();
    }

    public setLinkHandlingMethod(options: LinkHandlingOptions): void {
        this.linkHandlingOptions = options;

        const anchors = this.elm.getElementsByTagName("a");
        for (let i = 0; i < anchors.length; i++) {
            anchors[i].addEventListener("click", e =>
                this.anchorClickHandler(anchors[i], e)
            );
        }
    }

    private createScriptErrorWarning(): void {
        const div = document.createElement("div");
        div.classList.add("scriptErrorWarning");
        div.innerText = "Some scripts failed to run. Expect limited functionality.";
        this.elm.insertBefore(div, this.elm.firstChild);
    }

    private anchorClickHandler(anchor: HTMLAnchorElement, e: MouseEvent) {
        if (!e.cancelable || !this.linkHandlingOptions) { return; }
        e.preventDefault();
        const href = anchor.href;
        const parsed = url.parse(href);

        if (parsed.host === location.host) {
            const appState = parseAppStateURL(parsed);
            if (appState) {
                const opensWithLinks = this.linkHandlingOptions.openViewsWithLinks;
                ViewMap.get(appState.viewName).then(viewClass => {
                    if (viewClass && opensWithLinks) {
                        this.app.views.switchAndInit(viewClass, appState.stateData);
                    } else {
                        this.openLink(href);
                    }
                });
            } else {
                this.openLink(href);
            }
        } else {
            if (this.linkHandlingOptions.dontLeavePage) {
                openNoopener(href);
            } else {
                location.assign(href);
            }
        }
    }

    private openLink(href: string): void {
        if (!this.linkHandlingOptions) { return; }

        if (this.linkHandlingOptions.openFrameViewWithLinks) {
            openFrameView(this.app, href);
        } else if (this.linkHandlingOptions.dontLeavePage) {
            openNoopener(href);
        } else {
            location.assign(href);
        }
    }

    private parseHTML(html: string): HTMLDivElement {
        const div: HTMLDivElement = document.createElement("div");
        div.innerHTML = html;
        return div;
    }

    private getElementIdMap(): Map<string, Element> {
        const elementsWithId = this.elm.querySelectorAll("[id]");
        const idElementMap: Map<string, Element> = new Map();

        for (let i = 0; i < elementsWithId.length; i++) {
            const elm = elementsWithId[i];
            idElementMap.set(elm.id, elm);
        }
        return idElementMap;
    }

    private replaceViewElements(): void {
        for (const [name, view] of ViewMap) {
            const tagName = "japnaa:view:" + name;
            const elms = this.elm.getElementsByTagName(tagName);

            for (let i = 0; i < elms.length; i++) {
                const elm = elms[i];
                this.replaceViewElement(elm, view);
            }
        }
    }

    private replaceViewElement(elm: Element, viewClass: ViewClass | ViewClassGhost): void {
        const embededApp = new EmbededApp(this.app, elm);
        const stateData = elm.getAttribute("statedata");
        embededApp.setup();
        elm.classList.add("embededView");
        embededApp.views.open(viewClass, createViewState(viewClass, stateData || undefined));
    }

    private replaceWidgetElements(): void {
        for (const [name, view] of WidgetMap) {
            const tagName = "japnaa:widget:" + name;
            const elms = this.elm.getElementsByTagName(tagName);

            for (let i = 0; i < elms.length; i++) {
                const elm = elms[i];
                this.replaceWidgetElement(elm, view);
            }
        }
    }

    private replaceWidgetElement(elm: Element, widgetClass: WidgetClass): void {
        const widget = new widgetClass(...this.getWidgetArguments(elm));
        widget.setup();
        widget.appendTo(elm);
        elm.classList.add("embededWidget");
    }

    private getWidgetArguments(elm: Element): any[] {
        const args = elm.getAttribute("args");
        if (!args) { return []; }

        try {
            return JSON.parse("[" + args + "]");
        } catch {
            return [args];
        }
    }
}

export default HTMLViewDocument;