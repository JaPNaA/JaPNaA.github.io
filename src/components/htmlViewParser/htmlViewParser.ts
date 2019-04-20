import IApp from "../../types/app/iApp";
import HTMLViewDocument from "./htmlViewDocument";

type HTMLViewParserOptions = {
    scripts?: boolean,
    inlineJS?: boolean
};

class HTMLViewParser {
    private static inlineJSMatcher: RegExp = /\${{([^]+?)}}/g;
    private app: IApp;
    private options: HTMLViewParserOptions;

    constructor(app: IApp, options: HTMLViewParserOptions = {}) {
        this.app = app;
        this.options = options;
    }

    public parse(text_: string): HTMLViewDocument {
        let text: string = text_;

        if (this.options.inlineJS) {
            text = this.runInlineJS(text);
        }

        const doc = new HTMLViewDocument(this.app, text);

        if (this.options.scripts) {
            doc.runScripts();
        }

        doc.replaceElements();

        return doc;
    }

    private runInlineJS(text: string): string {
        return text.replace(HTMLViewParser.inlineJSMatcher, function (match: string, evalStr: string): string {
            const result: any = new Function(evalStr)();

            if (result === undefined) {
                return "";
            } else {
                return result.toString();
            }
        });
    }
}

export default HTMLViewParser;