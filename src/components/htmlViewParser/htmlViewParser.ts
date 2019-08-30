import IApp from "../../core/types/app/IApp";
import HTMLViewParserOptions from "./types/htmlViewParserOptions";
import HTMLViewDocument from "./htmlViewDocument";
import IHTMLViewDocument from "./iHTMLViewDocument";

class HTMLViewParser {
    private static inlineJSMatcher: RegExp = /\${{([^]+?)}}/g;
    private app: IApp;
    private options: HTMLViewParserOptions;

    constructor(app: IApp, options: HTMLViewParserOptions = {}) {
        this.app = app;
        this.options = options;
    }

    public parse(text_: string): IHTMLViewDocument {
        let text: string = text_;

        if (this.options.inlineJS) {
            text = this.runInlineJS(text);
        }

        const doc = new HTMLViewDocument(this.app, text);

        if (this.options.scripts) {
            doc.runScripts();
        }

        doc.moveStyleElementsToHead();
        doc.setLinkHandlingMethod(this.options);
        doc.replaceElements();

        return doc;
    }

    private runInlineJS(text: string): string {
        return text.replace(HTMLViewParser.inlineJSMatcher, function (match: string, evalStr: string): string {
            let result: any;
            try {
                result = new Function(evalStr)();
            } catch (err) {
                console.error(err);
                result = "[Inline JS Error]";
            }

            if (result === undefined) {
                return "";
            } else {
                return result.toString();
            }
        });
    }
}

export default HTMLViewParser;