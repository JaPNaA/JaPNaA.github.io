import ViewMap from "../../elm/views/viewMap";
import ViewClass from "../../types/viewClass";
import EmbededApp from "../../embededApp";

export default function htmlViewParse(text_: string, options: {
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

    replaceElements(div);

    return div;
}

const inlineJSMatcher: RegExp = /\${{([^]+?)}}/g;

function runInlineJS(text: string): string {
    return text.replace(inlineJSMatcher, function (match: string, evalStr: string): string {
        const result = global.eval(evalStr);

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
        const func = new Function("div", "id", script.innerHTML);
        func(div, idElementMap);
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

function replaceElements(div: HTMLDivElement) {
    for (const [name, view] of ViewMap) {
        const tagName = "japnaa:view:" + name;
        const elms = div.getElementsByTagName(tagName);

        for (let i = 0; i < elms.length; i++) {
            const elm = elms[i];
            replaceViewElement(elm, view);
        }
    }
}

function replaceViewElement(elm: Element, viewClass: ViewClass) {
    console.log(elm, viewClass);

    const embededApp = new EmbededApp(elm);
    const stateData = elm.getAttribute("statedata");
    embededApp.setup();
    elm.classList.add("embededView");

    const view = new viewClass(embededApp, stateData || undefined);
    view.setup();
    embededApp.addView(view);
}