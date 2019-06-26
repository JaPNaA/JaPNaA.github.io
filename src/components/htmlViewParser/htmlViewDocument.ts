import url from "url";
import siteConfig from "../../SiteConfig";
import IApp from "../../core/types/app/IApp";
import ViewMap from "../../core/view/ViewMap";
import EmbededApp from "../../core/app/EmbededApp";
import WidgetMap from "../../core/widget/WidgetMap";
import parseAppStateURL from "../../core/utils/parseAppStateURL";
import openNoopener from "../../core/utils/open/openNoopener";
import createAppState from "../../core/utils/createAppState";
import WidgetFactory from "../../core/widget/WidgetFactory";
import LinkHandlingOptions from "./types/linkHandlingOptions";
import openFrameView from "../../utils/openFrameView";
import IHTMLViewDocument from "./iHTMLViewDocument";
import Widget from "../../core/widget/Widget";

// TODO: Refactor, parseHTMLDocument and HTMLViewDocument do not do distinct enough things.

class HTMLViewDocument implements IHTMLViewDocument {
    public hasErrors: boolean;

    private elm: HTMLDivElement;
    private app: IApp;
    private embededApps: EmbededApp[];
    private widgets: Widget[];

    private linkHandlingOptions?: LinkHandlingOptions;

    constructor(app: IApp, text: string) {
        this.app = app;
        this.hasErrors = false;
        this.embededApps = [];
        this.widgets = [];

        this.elm = this.parseHTML(text);
        this.elm.classList.add("html-parsed");
    }

    public appendTo(parent: Element): void {
        parent.appendChild(this.elm);
    }

    public async destory(): Promise<void> {
        const destoryPromises = [];
        for (const app of this.embededApps) {
            destoryPromises.push(app.destory());
        }

        for (const widget of this.widgets) {
            widget.destory();
        }

        await Promise.all(destoryPromises);
    }

    public runScripts(): void {
        const scripts = this.elm.getElementsByTagName("script");
        const idElementMap = this.getElementIdMap();

        for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i];
            try {
                const func = new Function("div", "id", "SiteConfig", script.innerHTML);
                func(this.elm, idElementMap, siteConfig);
            } catch (err) {
                console.error(err);
                this.hasErrors = true;
            }
        }

        if (this.hasErrors) {
            this.createScriptErrorWarning();
        }
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

    public replaceElements(): void {
        const allElms = this.elm.getElementsByTagName("*");
        const start = "japnaa:";
        const viewStart = "view:";
        const widgetStart = "widget:";

        for (let i = 0; i < allElms.length; i++) {
            const elm = allElms[i];
            const tag = elm.tagName.toLowerCase();

            if (tag.startsWith("japnaa:")) {
                const rest = tag.slice(start.length);

                if (rest.startsWith(viewStart)) {
                    this.replaceViewElement(elm, rest.slice(viewStart.length));
                } else if (rest.startsWith(widgetStart)) {
                    this.replaceWidgetElement(elm, rest.slice(widgetStart.length));
                }
            }
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
                ViewMap.get(appState.viewName)
                    .then(viewClass => {
                        if (viewClass && opensWithLinks) {
                            this.app.views.switchAndInit(viewClass, appState.stateData);
                        } else {
                            this.openLink(href);
                        }
                    })
                    .catch(() => this.openLink(href));
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

    private async replaceViewElement(elm: Element, viewName: string): Promise<void> {
        const embededApp = new EmbededApp(this.app, elm);
        const stateData = elm.getAttribute("statedata");
        const viewClass = await ViewMap.get(viewName);
        embededApp.setup();
        elm.classList.add("embededView");
        embededApp.views.open(viewClass, createAppState(viewClass, stateData || undefined));
        this.embededApps.push(embededApp);
    }

    private async replaceWidgetElement(elm: Element, widgetName: string): Promise<void> {
        const widgetClass = await WidgetMap.get(widgetName);
        WidgetFactory.create(widgetClass, this.getWidgetArguments(elm))
            .then(widget => {
                widget.appendTo(elm);
                elm.classList.add("embededWidget");
                this.widgets.push(widget);
            });
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