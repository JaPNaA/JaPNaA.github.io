import SiteConfig from "../../siteConfig";
import IApp from "../../types/app/iApp";
import ViewMap from "../../elm/views/viewMap";
import EmbededApp from "../../app/embededApp";
import ViewClass from "../../types/viewClass";
import WidgetMap from "../../elm/widgets/widgetMap";
import WidgetClass from "../../types/widgetClass";
import IHTMLViewDocument from "./iHTMLViewDocument";
import LinkHandlingOptions from "./types/linkHandlingOptions";
import url from "url";
import parseAppStateURL from "../../utils/parseAppStateURL";
import openNoopener from "../../utils/open/openNoopener";
import openFrameView from "../../utils/open/openFrameView";


class HTMLViewDocument implements IHTMLViewDocument {
    private elm: HTMLDivElement;
    private app: IApp;
    private linkHandlingOptions?: LinkHandlingOptions;

    constructor(app: IApp, text: string) {
        this.app = app;

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
            const func = new Function("div", "id", "SiteConfig", script.innerHTML);
            func(this.elm, idElementMap, SiteConfig);
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

    private anchorClickHandler(anchor: HTMLAnchorElement, e: MouseEvent) {
        if (!e.cancelable || !this.linkHandlingOptions) { return; }
        e.preventDefault();
        const href = anchor.href;
        const parsed = url.parse(href);

        if (parsed.host === location.host) {
            const appState = parseAppStateURL(parsed);
            if (appState) {
                const viewClass = ViewMap.get(appState.viewName);
                if (viewClass && this.linkHandlingOptions.openViewsWithLinks) {
                    this.app.views.switchAndInit(viewClass, appState.stateData);
                } else {
                    this.openLink(href);
                }
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

    private replaceViewElement(elm: Element, viewClass: ViewClass): void {
        const embededApp = new EmbededApp(this.app, elm);
        const stateData = elm.getAttribute("statedata");
        embededApp.setup();
        elm.classList.add("embededView");

        const view = new viewClass(embededApp, stateData || undefined);
        view.setup();
        embededApp.views.add(view);
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