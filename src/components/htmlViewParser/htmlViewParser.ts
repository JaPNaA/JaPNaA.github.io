import ViewMap from "../../elm/views/viewMap";
import ViewClass from "../../types/viewClass";
import EmbededApp from "../../app/embededApp";
import WidgetMap from "../../elm/widgets/widgetMap";
import WidgetClass from "../../types/widgetClass";
import IApp from "../../types/app/iApp";
import SiteConfig from "../../siteConfig";

export default function htmlViewParse(app: IApp, text_: string, options: {
    scripts?: boolean,
    inlineJS?: boolean
} = {}): HTMLDivElement {
    let text = text_;

    if (options && options.inlineJS) {
        text = runInlineJS(text);
    }

    const div = parseHTML(text);
    div.classList.add("html-parsed");

    if (options && options.scripts) {
        runScripts(div);
    }

    replaceElements(div, app);

    return div;
}

const inlineJSMatcher: RegExp = /\${{([^]+?)}}/g;

function runInlineJS(text: string): string {
    return text.replace(inlineJSMatcher, function (match: string, evalStr: string): string {
        const result = new Function(evalStr)();

        if (result === undefined) {
            return "";
        } else {
            return result.toString();
        }
    });
}

function parseHTML(html: string): HTMLDivElement {
    const div: HTMLDivElement = document.createElement("div");
    div.innerHTML = html;
    return div;
}

function runScripts(div: HTMLDivElement) {
    const scripts = div.getElementsByTagName("script");
    const idElementMap = getElementIdMap(div);

    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        const func = new Function("div", "id", "SiteConfig", script.innerHTML);
        func(div, idElementMap, SiteConfig);
    }
}

function getElementIdMap(div: HTMLDivElement) {
    const elementsWithId = div.querySelectorAll("[id]");
    const idElementMap = new Map();

    for (let i = 0; i < elementsWithId.length; i++) {
        const elm = elementsWithId[i];
        idElementMap.set(elm.id, elm);
    }
    return idElementMap;
}

function replaceElements(div: HTMLDivElement, app: IApp) {
    replaceViewElements(div, app);
    replaceWidgetElements(div);
}

function replaceViewElements(div: HTMLDivElement, app: IApp) {
    for (const [name, view] of ViewMap) {
        const tagName = "japnaa:view:" + name;
        const elms = div.getElementsByTagName(tagName);

        for (let i = 0; i < elms.length; i++) {
            const elm = elms[i];
            replaceViewElement(app, elm, view);
        }
    }
}

function replaceViewElement(parentApp: IApp, elm: Element, viewClass: ViewClass) {
    const embededApp = new EmbededApp(parentApp, elm);
    const stateData = elm.getAttribute("statedata");
    embededApp.setup();
    elm.classList.add("embededView");

    const view = new viewClass(embededApp, stateData || undefined);
    view.setup();
    embededApp.views.add(view);
}

function replaceWidgetElements(div: HTMLDivElement) {
    for (const [name, view] of WidgetMap) {
        const tagName = "japnaa:widget:" + name;
        const elms = div.getElementsByTagName(tagName);

        for (let i = 0; i < elms.length; i++) {
            const elm = elms[i];
            replaceWidgetElement(elm, view);
        }
    }
}

function replaceWidgetElement(elm: Element, widgetClass: WidgetClass) {
    const widget = new widgetClass(...getWidgetArguments(elm));
    widget.setup();
    widget.appendTo(elm);
    elm.classList.add("embededWidget");
    console.log(widget);
}

function getWidgetArguments(elm: Element): any[] {
    const args = elm.getAttribute("args");
    if (!args) { return []; }

    try {
        return JSON.parse("[" + args + "]");
    } catch {
        return [args];
    }
}