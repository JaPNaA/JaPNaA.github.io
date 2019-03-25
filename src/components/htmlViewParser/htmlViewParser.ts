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