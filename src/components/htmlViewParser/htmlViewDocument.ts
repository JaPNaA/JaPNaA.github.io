import "./htmlViewDocument.less";

import url from "url";

import EmbededApp from "../../core/app/EmbededApp";
import IApp from "../../core/types/app/IApp";
import IHTMLViewDocument from "./iHTMLViewDocument";
import LinkHandlingOptions from "./types/linkHandlingOptions";
import Widget from "../../core/widget/Widget";
import htmlCollectionToArray from "../../utils/convertToArray";
import openFrameView from "../../utils/view/openFrameView";
import openNoopener from "../../core/utils/open/openNoopener";
import parseAppStateURL from "../../core/utils/parseAppStateURL";
import removeChildren from "../../utils/removeChildren";
import resolveUrl from "../../utils/resolveUrl";
import siteConfig from "../../SiteConfig";

// TODO: Refactor, parseHTMLDocument and HTMLViewDocument do not do distinct enough things.

class HTMLViewDocument implements IHTMLViewDocument {
    public hasErrors: boolean;

    private elm: HTMLDivElement;
    private app: IApp;
    private embededApps: EmbededApp[];
    private widgets: Widget[];
    private styleElms: HTMLStyleElement[];

    private linkHandlingOptions?: LinkHandlingOptions;
    private replaceElementsPromise?: Promise<void[]>;

    constructor(app: IApp, text: string) {
        this.app = app;
        this.hasErrors = false;
        this.embededApps = [];
        this.widgets = [];
        this.styleElms = [];

        this.elm = this.parseHTML(text);
        this.elm.classList.add("html-parsed");
    }

    public appendTo(parent: Element): void {
        parent.appendChild(this.elm);
    }

    public ready(): Promise<any> {
        if (this.replaceElementsPromise) {
            return this.replaceElementsPromise;
        } else {
            return Promise.resolve();
        }
    }

    public async destory(): Promise<void> {
        const destoryPromises = [];
        for (const app of this.embededApps) {
            destoryPromises.push(app.destory());
        }

        for (const widget of this.widgets) {
            widget.destory();
        }

        for (const style of this.styleElms) {
            document.head.removeChild(style);
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

    public moveStyleElementsToHead(): void {
        const styles = htmlCollectionToArray(this.elm.getElementsByTagName("style"));

        for (const style of styles) {
            document.head.appendChild(style);
            this.styleElms.push(style);
        }
    }

    public setLinkHandlingMethod(options: LinkHandlingOptions): void {
        this.linkHandlingOptions = options;

        const anchors = this.elm.getElementsByTagName("a");
        for (let i = 0; i < anchors.length; i++) {
            const anchor = anchors[i];
            const href = anchor.getAttribute("href");
            if (!href) { continue; }

            anchor.href = resolveUrl(href);

            anchor.addEventListener("click", e =>
                this.anchorClickHandler(anchor, e)
            );
        }
    }

    public replaceElements(): void {
        const allElms = this.elm.getElementsByTagName("*");
        const start = "japnaa:";
        const viewStart = "view:";
        const widgetStart = "widget:";

        const proms: Promise<void>[] = [];

        for (let i = 0; i < allElms.length; i++) {
            const elm = allElms[i];
            const tag = elm.tagName.toLowerCase();

            if (tag.startsWith("japnaa:")) {
                const rest = tag.slice(start.length);

                if (rest.startsWith(viewStart)) {
                    proms.push(
                        this.replaceViewElement(
                            elm,
                            rest.slice(viewStart.length)
                        )
                    );
                } else if (rest.startsWith(widgetStart)) {
                    proms.push(
                        this.replaceWidgetElement(
                            elm,
                            rest.slice(widgetStart.length)
                        )
                    );
                }
            }
        }

        this.replaceElementsPromise = Promise.all(proms);
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

                if (opensWithLinks) {
                    this.app.views.switchAndInit(appState.viewName, appState);
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
            openFrameView(href);
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
        elm.classList.add("embededView");

        const embededApp = new EmbededApp(this.app, elm);
        const stateData = elm.getAttribute("statedata");
        embededApp.setup();
        embededApp.views.open(viewName, stateData || undefined);
        elm.classList.add("loaded");
        this.embededApps.push(embededApp);
    }

    private async replaceWidgetElement(elm: Element, widgetName: string): Promise<void> {
        elm.classList.add("embededWidget");

        const widgetClass = await this.app.routes.getWidget(widgetName);
        const widget = new widgetClass(...this.getWidgetArguments(elm));
        widget.appendTo(elm);
        widget.setup();
        this.widgets.push(widget);
        elm.classList.add("loaded");
    }

    private getWidgetArguments(elm: Element): any[] {
        const argsAttr = elm.getAttribute("args");
        const appArgAttr = elm.getAttribute("app-arg");
        const childrenArgAttr = elm.getAttribute("children-arg");
        const args: any[] = [];

        if (appArgAttr !== null) {
            args.push(this.app);
        }

        if (childrenArgAttr !== null) {
            args.push(htmlCollectionToArray(elm.children));
            removeChildren(elm);
        }

        if (!argsAttr) { return args; }

        try {
            const parsed = JSON.parse("[" + argsAttr + "]");
            for (const parsedArg of parsed) {
                args.push(parsedArg);
            }
            return args;
        } catch {
            args.push(argsAttr);
            return args;
        }
    }
}

export default HTMLViewDocument;